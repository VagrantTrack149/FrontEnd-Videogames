window.electronAPI.readFile().then((files) => {
    const fileList = document.getElementById('file-list');
    files.forEach(file => {
        const li = document.createElement('li');
        li.textContent = file;
        fileList.appendChild(li);
    });
}).catch((error) => {
    console.error('Error leyendo directorios', error);
    const fileList = document.getElementById('file-list');
    fileList.textContent = 'Error cargando archivos.';
});