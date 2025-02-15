

interface StandardErrorArgs {
    name?: string;
    message: string;
  }
export class playerCountError extends Error {
    name: string;

    constructor(args: StandardErrorArgs) {
        super(args.message);
        Object.setPrototypeOf(this, new.target.prototype);
        this.name = args.name || 'Error';
    
    }
}
