const { ipcRenderer, contextBridge } = require('electron');

contextBridge.exposeInMainWorld('version', {
    app: (func) => {
        ipcRenderer.invoke('getAppVersion', 'test').then((result) => {
            func(result);
        })
    }
});