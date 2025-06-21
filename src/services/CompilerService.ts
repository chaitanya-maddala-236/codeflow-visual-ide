
export interface CompilationResult {
  success: boolean;
  output: string;
  errors: string[];
  warnings: string[];
  executionTime: number;
}

export interface Language {
  id: string;
  name: string;
  fileExtension: string;
  template: string;
}

export const SUPPORTED_LANGUAGES: Language[] = [
  {
    id: 'javascript',
    name: 'JavaScript',
    fileExtension: '.js',
    template: `function fibonacci(n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}

function main() {
    const result = fibonacci(10);
    console.log("Fibonacci(10) =", result);
    
    const numbers = [1, 2, 3, 4, 5];
    const doubled = numbers.map(x => x * 2);
    console.log("Doubled:", doubled);
    
    return result;
}

main();`
  },
  {
    id: 'python',
    name: 'Python',
    fileExtension: '.py',
    template: `def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)

def main():
    result = fibonacci(10)
    print(f"Fibonacci(10) = {result}")
    
    numbers = [1, 2, 3, 4, 5]
    doubled = [x * 2 for x in numbers]
    print(f"Doubled: {doubled}")
    
    return result

if __name__ == "__main__":
    main()`
  },
  {
    id: 'java',
    name: 'Java',
    fileExtension: '.java',
    template: `public class Main {
    public static int fibonacci(int n) {
        if (n <= 1) return n;
        return fibonacci(n - 1) + fibonacci(n - 2);
    }
    
    public static void main(String[] args) {
        int result = fibonacci(10);
        System.out.println("Fibonacci(10) = " + result);
        
        int[] numbers = {1, 2, 3, 4, 5};
        int[] doubled = new int[numbers.length];
        for (int i = 0; i < numbers.length; i++) {
            doubled[i] = numbers[i] * 2;
        }
        
        System.out.print("Doubled: [");
        for (int i = 0; i < doubled.length; i++) {
            System.out.print(doubled[i]);
            if (i < doubled.length - 1) System.out.print(", ");
        }
        System.out.println("]");
    }
}`
  }
];

class CompilerService {
  private static instance: CompilerService;
  private isRealTimeEnabled = true;

  public static getInstance(): CompilerService {
    if (!CompilerService.instance) {
      CompilerService.instance = new CompilerService();
    }
    return CompilerService.instance;
  }

  public setRealTimeCompilation(enabled: boolean): void {
    this.isRealTimeEnabled = enabled;
  }

  public async compileCode(code: string, language: string): Promise<CompilationResult> {
    const startTime = Date.now();
    
    try {
      // Simulate compilation delay
      await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));
      
      const result = await this.executeCode(code, language);
      const executionTime = Date.now() - startTime;
      
      return {
        success: true,
        output: result.output,
        errors: result.errors,
        warnings: result.warnings,
        executionTime
      };
    } catch (error) {
      return {
        success: false,
        output: '',
        errors: [error instanceof Error ? error.message : 'Unknown compilation error'],
        warnings: [],
        executionTime: Date.now() - startTime
      };
    }
  }

  private async executeCode(code: string, language: string): Promise<{
    output: string;
    errors: string[];
    warnings: string[];
  }> {
    switch (language) {
      case 'javascript':
        return this.executeJavaScript(code);
      case 'python':
        return this.simulatePythonExecution(code);
      case 'java':
        return this.simulateJavaExecution(code);
      default:
        throw new Error(`Unsupported language: ${language}`);
    }
  }

  private executeJavaScript(code: string): Promise<{
    output: string;
    errors: string[];
    warnings: string[];
  }> {
    return new Promise((resolve) => {
      const output: string[] = [];
      const errors: string[] = [];
      const warnings: string[] = [];

      // Capture console.log
      const originalLog = console.log;
      console.log = (...args) => {
        output.push(args.map(arg => String(arg)).join(' '));
      };

      try {
        // Execute the code
        const func = new Function(code);
        func();
        
        resolve({
          output: output.join('\n'),
          errors,
          warnings
        });
      } catch (error) {
        errors.push(error instanceof Error ? error.message : 'JavaScript execution error');
        resolve({
          output: output.join('\n'),
          errors,
          warnings
        });
      } finally {
        // Restore console.log
        console.log = originalLog;
      }
    });
  }

  private async simulatePythonExecution(code: string): Promise<{
    output: string;
    errors: string[];
    warnings: string[];
  }> {
    // Simulate Python execution
    const output: string[] = [];
    
    if (code.includes('fibonacci(10)')) {
      output.push('Fibonacci(10) = 55');
    }
    
    if (code.includes('doubled')) {
      output.push('Doubled: [2, 4, 6, 8, 10]');
    }
    
    return {
      output: output.join('\n'),
      errors: [],
      warnings: []
    };
  }

  private async simulateJavaExecution(code: string): Promise<{
    output: string;
    errors: string[];
    warnings: string[];
  }> {
    // Simulate Java execution
    const output: string[] = [];
    
    if (code.includes('fibonacci(10)')) {
      output.push('Fibonacci(10) = 55');
    }
    
    if (code.includes('doubled')) {
      output.push('Doubled: [2, 4, 6, 8, 10]');
    }
    
    return {
      output: output.join('\n'),
      errors: [],
      warnings: []
    };
  }

  public async validateSyntax(code: string, language: string): Promise<string[]> {
    const errors: string[] = [];
    
    if (language === 'javascript') {
      try {
        new Function(code);
      } catch (error) {
        errors.push(error instanceof Error ? error.message : 'Syntax error');
      }
    }
    
    return errors;
  }
}

export default CompilerService;
