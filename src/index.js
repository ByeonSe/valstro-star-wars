import { io } from "socket.io-client";
import { createInterface } from "readline";

// create an interface for the input and output
let rl = createInterface(process.stdin, process.stdout);

// set a statment and display the statement 
rl.setPrompt("\nWhat character would you like to search for?");

// connect to the server
const socket = io("http://localhost:3000"); 

// add a listener method
rl.on("line", (input) => {
    socket.emit("search", { query: input });
  })

// search logic starts here:
let currentCount = 0;

// add event lister for search 
socket.on("search", (words) => {
  const data = JSON.parse(JSON.stringify(words)); 

  //if error, log the error
  if (data.error !== undefined) {
    console.log(`\nERROR: ${data.error}`);
    rl.prompt();
  }

  //if there is a returned value, increment current count and log the data
  currentCount++;
  console.log(
    `(${data.page}/${data.resultCount}) ${data.name} - [${data.films}]`
  ); 

  // reset the count and display the prompt
  if (currentCount >= data.resultCount) {
    currentCount = 0;
    rl.prompt();
  }
});


// exit the app
rl.on("close", () => {
  console.log("\nExiting the app...Bye!");
  socket.close();
  //Node.js: process withut any kind of failure 
  process.exit(0);
});

 
