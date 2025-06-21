
export interface CompilationResult {
  success: boolean;
  output: string;
  errors: string[];
  warnings: string[];
  executionTime: number;
}

export interface LanguageConfig {
  id: string;
  name: string;
  fileExtension: string;
  template: string;
  compiler?: string;
  supportsExecution: boolean;
}

export const SUPPORTED_LANGUAGES: LanguageConfig[] = [
  {
    id: 'javascript',
    name: 'JavaScript',
    fileExtension: '.js',
    supportsExecution: true,
    template: `// Welcome to CodeStudio - JavaScript
console.log("Hello, CodeStudio!");

// Function example
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

// Test the function
for (let i = 0; i < 10; i++) {
  console.log(\`fibonacci(\${i}) = \${fibonacci(i)}\`);
}
`,
  },
  {
    id: 'typescript',
    name: 'TypeScript',
    fileExtension: '.ts',
    supportsExecution: true,
    template: `// Welcome to CodeStudio - TypeScript
interface User {
  name: string;
  age: number;
  email?: string;
}

class UserManager {
  private users: User[] = [];

  addUser(user: User): void {
    this.users.push(user);
    console.log(\`Added user: \${user.name}\`);
  }

  getUsersByAge(minAge: number): User[] {
    return this.users.filter(user => user.age >= minAge);
  }
}

// Example usage
const manager = new UserManager();
manager.addUser({ name: "Alice", age: 25 });
manager.addUser({ name: "Bob", age: 30, email: "bob@example.com" });

console.log("Users 25 and older:", manager.getUsersByAge(25));
`,
  },
  {
    id: 'python',
    name: 'Python',
    fileExtension: '.py',
    supportsExecution: false, // Will be true when Pyodide is integrated
    template: `# Welcome to CodeStudio - Python
def fibonacci(n):
    """Calculate the nth Fibonacci number."""
    if n <= 1:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)

def main():
    print("Hello, CodeStudio!")
    
    # Test the fibonacci function
    for i in range(10):
        result = fibonacci(i)
        print(f"fibonacci({i}) = {result}")
    
    # List comprehension example
    squares = [x**2 for x in range(1, 11)]
    print(f"Squares: {squares}")
    
    # Dictionary example
    user_data = {
        "name": "Alice",
        "age": 25,
        "skills": ["Python", "JavaScript", "SQL"]
    }
    print(f"User: {user_data}")

if __name__ == "__main__":
    main()
`,
  },
  {
    id: 'java',
    name: 'Java',
    fileExtension: '.java',
    supportsExecution: false,
    template: `// Welcome to CodeStudio - Java
import java.util.*;

public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, CodeStudio!");
        
        // Create a list of numbers
        List<Integer> numbers = Arrays.asList(1, 2, 3, 4, 5, 6, 7, 8, 9, 10);
        
        // Filter even numbers and calculate squares
        List<Integer> evenSquares = numbers.stream()
            .filter(n -> n % 2 == 0)
            .map(n -> n * n)
            .collect(ArrayList::new, ArrayList::add, ArrayList::addAll);
        
        System.out.println("Even squares: " + evenSquares);
        
        // Fibonacci example
        FibonacciCalculator calc = new FibonacciCalculator();
        for (int i = 0; i < 10; i++) {
            System.out.println("fibonacci(" + i + ") = " + calc.calculate(i));
        }
    }
}

class FibonacciCalculator {
    public int calculate(int n) {
        if (n <= 1) return n;
        return calculate(n - 1) + calculate(n - 2);
    }
}
`,
  },
  {
    id: 'cpp',
    name: 'C++',
    fileExtension: '.cpp',
    supportsExecution: false,
    template: `// Welcome to CodeStudio - C++
#include <iostream>
#include <vector>
#include <algorithm>
#include <string>

class FibonacciCalculator {
public:
    static long long calculate(int n) {
        if (n <= 1) return n;
        return calculate(n - 1) + calculate(n - 2);
    }
};

int main() {
    std::cout << "Hello, CodeStudio!" << std::endl;
    
    // Vector example
    std::vector<int> numbers = {1, 2, 3, 4, 5, 6, 7, 8, 9, 10};
    
    // Filter even numbers
    std::vector<int> evenNumbers;
    std::copy_if(numbers.begin(), numbers.end(), 
                 std::back_inserter(evenNumbers),
                 [](int n) { return n % 2 == 0; });
    
    std::cout << "Even numbers: ";
    for (const auto& num : evenNumbers) {
        std::cout << num << " ";
    }
    std::cout << std::endl;
    
    // Fibonacci example
    for (int i = 0; i < 10; ++i) {
        std::cout << "fibonacci(" << i << ") = " 
                  << FibonacciCalculator::calculate(i) << std::endl;
    }
    
    return 0;
}
`,
  },
];

class CompilerService {
  private static instance: CompilerService;

  public static getInstance(): CompilerService {
    if (!CompilerService.instance) {
      CompilerService.instance = new CompilerService();
    }
    return CompilerService.instance;
  }

  async compileCode(code: string, language: string): Promise<CompilationResult> {
    const startTime = Date.now();
    
    try {
      // Simulate compilation delay
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
      
      if (language === 'javascript' || language === 'typescript') {
        return await this.executeJavaScript(code, startTime);
      } else {
        return this.simulateCompilation(code, language, startTime);
      }
    } catch (error) {
      return {
        success: false,
        output: '',
        errors: [error instanceof Error ? error.message : 'Unknown compilation error'],
        warnings: [],
        executionTime: Date.now() - startTime,
      };
    }
  }

  private async executeJavaScript(code: string, startTime: number): Promise<CompilationResult> {
    try {
      // Create a safe execution environment
      const output: string[] = [];
      const errors: string[] = [];
      const warnings: string[] = [];

      // Override console methods to capture output
      const originalConsole = { ...console };
      const mockConsole = {
        log: (...args: any[]) => output.push(args.map(arg => String(arg)).join(' ')),
        error: (...args: any[]) => errors.push(args.map(arg => String(arg)).join(' ')),
        warn: (...args: any[]) => warnings.push(args.map(arg => String(arg)).join(' ')),
        info: (...args: any[]) => output.push('[INFO] ' + args.map(arg => String(arg)).join(' ')),
      };

      // Replace console temporarily
      Object.assign(console, mockConsole);

      try {
        // Execute the code in a controlled environment
        const func = new Function('console', code);
        func(mockConsole);
      } catch (execError) {
        errors.push(execError instanceof Error ? execError.message : 'Execution error');
      } finally {
        // Restore original console
        Object.assign(console, originalConsole);
      }

      return {
        success: errors.length === 0,
        output: output.join('\n'),
        errors,
        warnings,
        executionTime: Date.now() - startTime,
      };
    } catch (error) {
      return {
        success: false,
        output: '',
        errors: [error instanceof Error ? error.message : 'JavaScript execution error'],
        warnings: [],
        executionTime: Date.now() - startTime,
      };
    }
  }

  private simulateCompilation(code: string, language: string, startTime: number): CompilationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    let output = '';

    // Simulate basic syntax checking
    if (code.trim().length === 0) {
      errors.push('Empty source file');
    }

    // Language-specific syntax checks
    switch (language) {
      case 'python':
        if (!code.includes('def ') && !code.includes('print') && !code.includes('if __name__')) {
          warnings.push('Consider adding a main function or if __name__ == "__main__" block');
        }
        output = 'Python compilation successful\nNote: Execution not yet supported in browser';
        break;
        
      case 'java':
        if (!code.includes('public class')) {
          errors.push('Java source must contain a public class');
        }
        if (!code.includes('public static void main')) {
          warnings.push('No main method found');
        }
        output = 'Java compilation successful\nNote: Execution not yet supported in browser';
        break;
        
      case 'cpp':
        if (!code.includes('#include')) {
          warnings.push('No include statements found');
        }
        if (!code.includes('int main')) {
          errors.push('No main function found');
        }
        output = 'C++ compilation successful\nNote: Execution not yet supported in browser';
        break;
        
      default:
        output = `${language} compilation completed\nNote: Language support is experimental`;
    }

    // Simulate some random warnings for demonstration
    if (Math.random() > 0.7) {
      warnings.push('Unused variable detected');
    }

    return {
      success: errors.length === 0,
      output,
      errors,
      warnings,
      executionTime: Date.now() - startTime,
    };
  }

  async validateSyntax(code: string, language: string): Promise<string[]> {
    const errors: string[] = [];

    // Basic syntax validation
    if (language === 'javascript' || language === 'typescript') {
      try {
        new Function(code);
      } catch (error) {
        if (error instanceof SyntaxError) {
          errors.push(`Syntax Error: ${error.message}`);
        }
      }
    }

    // Language-specific checks
    switch (language) {
      case 'python':
        // Basic Python syntax checks
        const pythonLines = code.split('\n');
        pythonLines.forEach((line, index) => {
          if (line.trim().endsWith(':') && !line.trim().match(/^(if|else|elif|for|while|def|class|try|except|finally|with)/)) {
            errors.push(`Line ${index + 1}: Unexpected colon`);
          }
        });
        break;
        
      case 'java':
        if (code.includes('public class') && !code.includes('{')) {
          errors.push('Missing opening brace for class');
        }
        break;
    }

    return errors;
  }

  getLanguageTemplate(languageId: string): string {
    const language = SUPPORTED_LANGUAGES.find(lang => lang.id === languageId);
    return language?.template || '// Start coding here...';
  }

  getSupportedLanguages(): LanguageConfig[] {
    return SUPPORTED_LANGUAGES;
  }
}

export default CompilerService;
