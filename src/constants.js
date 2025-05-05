export const Judge0Credentials = {
  // Replace with your actual RapidAPI Judge0 key.
  // rapidApiKey: "85d64787a0mshfb99df63eafbb24p184026jsn7553bb062d55",
  // rapidApiKey: "d322203cc7msh23d71a68ec96134p1c140fjsn1f8cd4b036c7", // This is not working
  // rapidApiKey: "9ec5ed521fmsh33eb86defde697bp1fde95jsn282305aef86b",
  // rapidApiKey: "266ebd9971mshd0a74fe345408e0p15c75cjsb298b93796aa",  // This is not working
  rapidApiKey: "64430305ccmsh6a779eb687c008fp1b240ejsn4eceee5179e9",
};

export const LANGUAGE_IDS = {
  javascript: 63,  // JavaScript (Node.js)
  typescript: 74,  // TypeScript
  python: 71,      // Python 3 (e.g. 3.8.1)
  java: 62,        // Java (JDK 13)
  csharp: 51,      // C# (Mono)
  php: 68,         // PHP
  c: 50,           // C (GCC 9.2.0)
  cpp: 54,         // C++ (GCC 9.2.0)
  ruby: 72,        // Ruby (2.7.2)
  go: 60,          // Go (1.14.2)
};

export const CODE_SNIPPETS = {
  javascript: `// This is JavaScript code
function greet(name) {
  console.log("Hello from, " + name + "!");
}
greet("JavaScript");
`,
  typescript: `// This is TypeScript code
type Params = { name: string };
function greet(data: Params) {
  console.log("Hello from, " + data.name + "!");
}
greet({ name: "TypeScript" });
`,
  python: `# This is Python code
print("Hello from, Python")
`,
  java: `// This is Java code
public class Main {
  public static void main(String[] args) {
    System.out.println("Hello from, Java");
  }
}
`,
  csharp: `// This is C# code
using System;
class Program {
  static void Main(string[] args) {
    Console.WriteLine("Hello from, C#");
  }
}
`,
  php: `<?php
// This is PHP code
$name = "Hello from, PHP!";
echo $name;
`,
  c: `// This is C code
#include <stdio.h>
int main() {
  printf("Hello from, C\\n");
  return 0;
}
`,
  cpp: `// This is C++ code
#include <iostream>
int main() {
  std::cout << "Hello from, C++";
  return 0;
}
`,
  ruby: `# This is Ruby code
puts "Hello from, Ruby"
`,
  go: `// This is Go code
package main
import "fmt"
func main() {
  fmt.Println("Hello from, Go")
}
`,
};
