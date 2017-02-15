var promiseChain = function(resolveHandler, rejectHandler){
    this.failed = (error) => {
        return rejectHandler(error);
    };

    this.throw = (message, error) => {
        console.log(error);
        return this.error(message)(error)
                    .catch(this.failed);
    };

    this.error = (message) => {
        let stack = new Error().stack;

        return (error) => Promise.reject({
            message, error, stack
        });
    };

    this.success = (data) => {
        return resolveHandler(data);
    };
};

module.exports = promiseChain;