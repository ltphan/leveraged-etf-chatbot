export const throttle = (fn: any, delayInMs: number) => {
    let lastCallTimeInMs = 0

    return (...args: any) => {
        const now = Date.now()
        
        if (now - lastCallTimeInMs >= delayInMs) {
            lastCallTimeInMs = now
            fn(...args)
        }
        
    }
}