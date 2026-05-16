self.onmessage = (event) => {
    let result = undefined;
    try {
        result = Function(event.data)();
    } catch (error) {
        result = error?.toString();
    }
    if (result === undefined) {
        result = 'undefined';
    } else {
        result = JSON.stringify(result);
    };
    postMessage(result);
};