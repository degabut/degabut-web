export namespace rpc {
	
	export class Assets {
	    large_image?: string;
	    large_text?: string;
	    small_image?: string;
	    small_text?: string;
	
	    static createFrom(source: any = {}) {
	        return new Assets(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.large_image = source["large_image"];
	        this.large_text = source["large_text"];
	        this.small_image = source["small_image"];
	        this.small_text = source["small_text"];
	    }
	}
	export class Timestamps {
	    start?: number;
	    end?: number;
	
	    static createFrom(source: any = {}) {
	        return new Timestamps(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.start = source["start"];
	        this.end = source["end"];
	    }
	}
	export class Activity {
	    state: string;
	    details: string;
	    timestamps?: Timestamps;
	    assets?: Assets;
	
	    static createFrom(source: any = {}) {
	        return new Activity(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.state = source["state"];
	        this.details = source["details"];
	        this.timestamps = this.convertValues(source["timestamps"], Timestamps);
	        this.assets = this.convertValues(source["assets"], Assets);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	
	export class Pan {
	    left: number;
	    right: number;
	
	    static createFrom(source: any = {}) {
	        return new Pan(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.left = source["left"];
	        this.right = source["right"];
	    }
	}
	export class SetUserVoiceSettingsCommandArgs {
	    user_id: string;
	    volume: number;
	    mute: boolean;
	    pan: Pan;
	
	    static createFrom(source: any = {}) {
	        return new SetUserVoiceSettingsCommandArgs(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.user_id = source["user_id"];
	        this.volume = source["volume"];
	        this.mute = source["mute"];
	        this.pan = this.convertValues(source["pan"], Pan);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}

}

