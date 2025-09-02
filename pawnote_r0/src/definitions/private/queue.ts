interface QueueItem {
	promise: () => Promise<unknown>;
	resolve: (value: any) => void;
	reject: (error?: any) => void;
}

export class Queue {
	private queue: QueueItem[] = [];
	private pendingPromise: boolean = false;

	public push<T extends unknown>(promise: () => Promise<T>): Promise<T> {
		return new Promise<T>((resolve, reject) => {
			this.queue.push({
				promise,
				resolve,
				reject,
			});

			if (!this.pendingPromise) {
				this.dequeue();
			}
		});
	}

	private dequeue() {
		if (this.pendingPromise) return false;

		const item = this.queue.shift();
		if (!item) return false;

		this.pendingPromise = true;

		item.promise()
			.then((value) => {
				item.resolve(value);
				this.pendingPromise = false;
				this.dequeue();
			})
			.catch((err) => {
				item.reject(err);
				this.pendingPromise = false;
				this.dequeue();
			});

		return true;
	}
}
