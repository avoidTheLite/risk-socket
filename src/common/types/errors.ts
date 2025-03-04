

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

export class gameNotFoundError extends Error {
    name: string;

    constructor(args: StandardErrorArgs) {
        super(args.message);
        Object.setPrototypeOf(this, new.target.prototype);
        this.name = args.name || 'Error';
    
    }
}

export class globeNotFoundError extends Error {
    name: string;

    constructor(args: StandardErrorArgs) {
        super(args.message);
        Object.setPrototypeOf(this, new.target.prototype);
        this.name = args.name || 'Error';
    }
}

export class saveGameError extends Error {
    name: string;

    constructor(args: StandardErrorArgs) {
        super(args.message);
        Object.setPrototypeOf(this, new.target.prototype);
        this.name = args.name || 'Error';
    }
}

export class dbInsertError extends Error {
    name: string;

    constructor(args: StandardErrorArgs) {
        super(args.message);
        Object.setPrototypeOf(this, new.target.prototype);
        this.name = args.name || 'Error';
    }
}

export class deployError extends Error {
    name: string;

    constructor(args: StandardErrorArgs) {
        super(args.message);
        Object.setPrototypeOf(this, new.target.prototype);
        this.name = args.name || 'Error';
    }
}

export class turnError extends Error {
    name: string;

    constructor(args: StandardErrorArgs) {
        super(args.message);
        Object.setPrototypeOf(this, new.target.prototype);
        this.name = args.name || 'Error';
    }
}