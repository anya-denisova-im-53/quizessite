window.Storage = {
    save(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    },

    load(key, defaultValue = []) {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : defaultValue;
    },

    remove(key) {
        localStorage.removeItem(key);
    }
};
Storage.save()
Storage.load()
Storage.remove()
