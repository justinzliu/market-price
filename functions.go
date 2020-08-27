package main

import (
	"encoding/json"
	"fmt"
	//need libzmq3-dev, dependency for zmq4
	zmq "github.com/pebbe/zmq4" //github.com/pebbe/zmq4 for zmq4
)

/////////////////////
//Support Functions//
/////////////////////

//return slice with element from index i removed
func removeIndex(arr []map[string]string, index uint64) []map[string]string {
	if(len(arr) < 1){return arr}
	arr[index] = arr[len(arr)-1]
	arr = arr[:len(arr)-1]
	return arr
}

//check for valid JSON
func validJSON(objs []map[string]string) bool {
	isValid := true
	if(len(objs) < 2){ 
		//map missing category or results
		fmt.Println("validJSON: map missing category or results")
		isValid = false
	//} else if(len(objs[1]) < 1 || len(objs[0]) < 1){ //if choice on histogram is fixed. See TODO in index.js
	} else if(len(objs[0]) < 1){
		//empty category or results
		fmt.Println("validJSON: empty category or results")
		isValid = false
	}
 	return isValid
}

//get keys of map
func getKeys(obj map[string]string) []string {
	keys := make([]string,0)
	for key, _ := range obj {
		keys = append(keys,key)
	}
	return keys
}

//check if truncation happened
func wasTruncated(num1 uint64, num2 uint64) bool {
	truncated := false 
	if(num1%num2 > 0){truncated = true}
	return truncated
}

//calculate reasonable chunk size
func getChunkSize(len uint64) uint64 {
	//adjust variables for optimal goroutine workload balance
	concurrency_cutoff := uint64(20)
	maxWorkers := uint64(25)
	minChunkSize := concurrency_cutoff/2
	chunk_size := minChunkSize
	currWorkers := len/minChunkSize
	if(wasTruncated(len,minChunkSize)){currWorkers+=1}
	if(len > concurrency_cutoff){
		truncated := false
		if(currWorkers > maxWorkers){
			//set chunk_size for maxWorkers
			chunk_size = len/maxWorkers
			truncated = wasTruncated(len,maxWorkers)
		} else {
			//set chunk_size for currWorkers with minimum load
			chunk_size = len/currWorkers
			truncated = wasTruncated(len,currWorkers)
		}
		if(truncated){chunk_size+=1}
	}
	return chunk_size
}


/////////////////////
//Primary Functions//
/////////////////////

func countColumns_chunk(objs []map[string]string, col string, result chan map[string]int) {
	var counts = map[string]int{}
	for _, obj := range objs {
		colVal := obj[col]
		counts[colVal] += 1
	}
	result <- counts
}

//get counts of each column - used for histograms
func countColumns(objs []map[string]string) []byte {
	//extract category
	//col := objs[0]["category"]
	col := "location" //to bypass issue with javascript, see TODO in index.js
	objs = removeIndex(objs,0)
	PrintJSON(objs)
	//get reasonable chunk_size and worker goroutines
	objs_len := uint64(len(objs))
	chunk_size := getChunkSize(objs_len)
	num_goroutines := objs_len/chunk_size
	if(wasTruncated(objs_len,chunk_size)){num_goroutines+=1}
	//initialize channel and counts map
	countsChan := make(chan map[string]int, num_goroutines)
	var counts = map[string]int{}
	//break objs into chunks, call countColumns_chunk to count each chunk of objs
	for i := uint64(0); i < num_goroutines; i++ {
		chunk_start := i*chunk_size
		chunk_end := chunk_start + chunk_size
		if(chunk_end > objs_len){chunk_end = objs_len} //ensure chunk range does not exceed length of objs
		go countColumns_chunk(objs[chunk_start:chunk_end], col, countsChan)
	}
	var tempCounts = map[string]int{}
	for j := uint64(0); j < num_goroutines; j++ {
		tempCounts = <-countsChan
		for key, val := range tempCounts {
			counts[key] += val
		}
	}
	countsJSON, err := json.Marshal(counts)
	if(err != nil){fmt.Println("ERROR: Encoding to JSON failed.")}
	return countsJSON
}

///////////////////////
//Debugging Functions//
///////////////////////

func PrintJSON(objs []map[string]string) {
	keys := getKeys(objs[0])
	for _, obj := range objs {
		//Reading each value by its key
		for _, key := range keys {
			key_str := key + ": "
			fmt.Println(key_str,obj[key])
		}
		fmt.Println("\n")
	}
}

func seq_countColumns(objs []map[string]string, col string) map[string]int {
	var counts = map[string]int{}
	for _, obj := range objs {
		colVal := obj[col]
		counts[colVal] += 1
	}
	return counts
}

func rep_socket_monitor(addr string) {
    s, err := zmq.NewSocket(zmq.PAIR)
    if err != nil {
        fmt.Println(err)
    }
    err = s.Connect(addr)
    if err != nil {
        fmt.Println(err)
    }
    for {
        a, b, c, err := s.RecvEvent(0)
        if err != nil {
            fmt.Println(err)
            break
        }
        fmt.Println(a, b, c)
    }
    s.Close()
}

////////////////////
//Listening Server//
////////////////////

func main() {
	reciever, err := zmq.NewSocket(zmq.REP)
	defer reciever.Close()
	if(err != nil){fmt.Println(err)}
	reciever.Bind("tcp://127.0.0.1:5555")
	for {
		fmt.Println("listening...") 
		msg, err := reciever.RecvBytes(0)
		if(err != nil){fmt.Println(err); break}
		fmt.Println("something received") 
		var msg_obj []map[string]string
		json.Unmarshal(msg, &msg_obj)
		var res []byte
		if(validJSON(msg_obj)){
			res = countColumns(msg_obj)
		} else{
			err_msg := make(map[string]int)
			error_msg := make([]map[string]int,0)
			err_msg["ERROR"] = 1
			error_msg = append(error_msg, err_msg)
			res, _ = json.Marshal(error_msg)
		}
		reciever.SendBytes(res, 0)
	}
}