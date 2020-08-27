// node zmq_request.js
const zmq = require("zeromq");

// UTF-8 handing from https://stackoverflow.com/a/13691499
function encode_utf8(s) {
  return unescape(encodeURIComponent(s));
}
function decode_utf8(s) {
  return decodeURIComponent(escape(s));
}

// adapted from https://github.com/zeromq/zeromq.js/#reqrep
async function run() {
  const sock = new zmq.Request;
  sock.connect("tcp://127.0.0.1:5555");

  var arg1 = {"category": "location"}
  var arg2 = [{"title": "Senior Software Developer", "company": "Scientific Research Corporation", "location": "Kent, WA"}, {"title": "Remote Senior Full Stack PHP Developer", "company": "CyberCoders", "location": "Seattle, WA"}, {"title": "Software Engineer", "company": "Convoy, Inc.", "location": "Seattle, WA"}, {"title": "Java Back End developer", "company": "Zencon Group Inc", "location": "Seattle, WA"}, {"title": "Core JAVA Developer/Lead (No J2EE) at Seattle, WA", "company": "LOGIC SOFT", "location": "Seattle, WA"}, {"title": "Redis developer", "company": "Genius Business Solutions Inc", "location": "Bellevue, WA"}, {"title": "Software Engineer", "company": "Google LLC", "location": "Kirkland, WA"}, {"title": ".NET Full Stack Developer", "company": "Tasacom", "location": "Redmond, WA"}, {"title": "Software Development Engineer", "company": "Pactera Technologies", "location": "Redmond, WA"}, {"title": "Senior Full Stack Python Developer", "company": "Company Confidential", "location": "Redmond, WA"}, {"title": "MECHANICAL ENGINEER JOURNEYMAN-SW", "company": "McLaughlin Research Corp.", "location": "Keyport, WA"}, {"title": "Mobile iOS - Engineer, Software", "company": "T-Mobile", "location": "Bellevue, WA"}, {"title": "Software Engineer/Developer C# & SQL; Redmond/Bellevue, WA; Immediate", "company": "Wicresoft", "location": "Redmond, WA"}, {"title": "Logistics Programmer", "company": "Amazon.com Services LLC", "location": "Seattle, WA"}, {"title": "C# .Net Developer", "company": "Zen3 Infosolutions (America) Inc", "location": "Redmond, WA"}, {"title": "SDET / Hardware Tester", "company": "Harman Connected Services Corporation India Private Limited", "location": "Redmond, WA"}, {"title": ".Net Developer", "company": "Wipro Limited", "location": "Redmond, WA"}, {"title": "Software Engineering Lead", "company": "Cytiva", "location": "Issaquah, WA"}, {"title": "Senior Software Developer", "company": "Harvey Nash, Inc", "location": "Seattle, WA"}, {"title": "Lead Software Development Engineer Test", "company": "ProKarma", "location": "Seattle, WA"}, {"title": "Business Intelligence Engineer III", "company": "Metro Systems, Inc.", "location": "Seattle, WA"}, {"title": "Software Developer", "company": "Widenet Consulting", "location": "Seattle, WA"}, {"title": "Informatica Developer", "company": "Cognizant", "location": "Seattle, WA"}, {"title": "(2405) Software Development Engineer - IGS", "company": "The Judge Group", "location": "SeaTac, WA"}, {"title": "Application Developer", "company": "Randstad Technologies", "location": "Redmond, WA"}];
  var arg = arg2.slice()
  arg.unshift(arg1)

  //console.log(arg1);
  //console.log(arg2);
  const request = encode_utf8(JSON.stringify(arg));
  //const arg = '[{"category": "title"}, {"title": "Senior Software Developer", "company": "Scientific Research Corporation", "location": "Kent, WA"}, {"title": "Remote Senior Full Stack PHP Developer", "company": "CyberCoders", "location": "Seattle, WA"}, {"title": "Software Engineer", "company": "Convoy, Inc.", "location": "Seattle, WA"}, {"title": "Java Back End developer", "company": "Zencon Group Inc", "location": "Seattle, WA"}, {"title": "Core JAVA Developer/Lead (No J2EE) at Seattle, WA", "company": "LOGIC SOFT", "location": "Seattle, WA"}, {"title": "Redis developer", "company": "Genius Business Solutions Inc", "location": "Bellevue, WA"}, {"title": "Software Engineer", "company": "Google LLC", "location": "Kirkland, WA"}, {"title": ".NET Full Stack Developer", "company": "Tasacom", "location": "Redmond, WA"}, {"title": "Software Development Engineer", "company": "Pactera Technologies", "location": "Redmond, WA"}, {"title": "Senior Full Stack Python Developer", "company": "Company Confidential", "location": "Redmond, WA"}, {"title": "MECHANICAL ENGINEER JOURNEYMAN-SW", "company": "McLaughlin Research Corp.", "location": "Keyport, WA"}, {"title": "Mobile iOS - Engineer, Software", "company": "T-Mobile", "location": "Bellevue, WA"}, {"title": "Software Engineer/Developer C# & SQL; Redmond/Bellevue, WA; Immediate", "company": "Wicresoft", "location": "Redmond, WA"}, {"title": "Logistics Programmer", "company": "Amazon.com Services LLC", "location": "Seattle, WA"}, {"title": "C# .Net Developer", "company": "Zen3 Infosolutions (America) Inc", "location": "Redmond, WA"}, {"title": "SDET / Hardware Tester", "company": "Harman Connected Services Corporation India Private Limited", "location": "Redmond, WA"}, {"title": ".Net Developer", "company": "Wipro Limited", "location": "Redmond, WA"}, {"title": "Software Engineering Lead", "company": "Cytiva", "location": "Issaquah, WA"}, {"title": "Senior Software Developer", "company": "Harvey Nash, Inc", "location": "Seattle, WA"}, {"title": "Lead Software Development Engineer Test", "company": "ProKarma", "location": "Seattle, WA"}, {"title": "Business Intelligence Engineer III", "company": "Metro Systems, Inc.", "location": "Seattle, WA"}, {"title": "Software Developer", "company": "Widenet Consulting", "location": "Seattle, WA"}, {"title": "Informatica Developer", "company": "Cognizant", "location": "Seattle, WA"}, {"title": "(2405) Software Development Engineer - IGS", "company": "The Judge Group", "location": "SeaTac, WA"}, {"title": "Application Developer", "company": "Randstad Technologies", "location": "Redmond, WA"}]';
  //const request = encode_utf8(arg);
  await sock.send(request)
  const [response_bytes] = await sock.receive()
  const response = JSON.parse(decode_utf8(response_bytes));
  console.log(response);
}

run()