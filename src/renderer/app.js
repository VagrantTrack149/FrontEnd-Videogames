angular.module('gameMenuApp', [])
.controller('MainController', function($scope, $timeout) {
    $scope.title = "Solaris Game Menu";
    $scope.games = [];
    $scope.showAddForm = false;
    $scope.newGame = {
        name: '',
        exePath: '',
        image: null
    };

    // Función para verificar y cargar la API
    $scope.initElectronAPI = function() {
        if (window.electronAPI) {
            $scope.loadGames();
        } else {
            $timeout($scope.initElectronAPI, 100);
        }
    };

    // Cargar juegos
    $scope.loadGames = function() {
        window.electronAPI.getGames().then(games => {
            $scope.games = games;
            
            // Obtener rutas de imágenes
            $scope.games.forEach(game => {
                window.electronAPI.getImagePath(game.id).then(imageData => {
                    if (imageData) {
                        game.imageData = imageData;
                        game.imageLoaded=true;
                    }else{
                        game.imageData = null;
                        game.imageLoaded=false;
                    }
                    $scope.$apply();
                    //No se, que cosa no sirva, pero creo que no guarda, dejo este comentario para hacerlo luego xd
                    //tal vez guarde la imagen en base64 en el .json de cada juego
                    //recordar, rehacer el .json de cada juego para que tenga un campo imageData y hacer que lo lea de ahi.
                    //ya ni sé, cambiar los colores y demás, pero aun sigo viendo que onda con angular.
                });
            });
            
            $scope.$apply();
        }).catch(error => {
            console.error('Error loading games:', error);
        });
    };

    // Ejecutar juego al hacer clic
    $scope.playGame = function(game) {
        window.electronAPI.executeGame(game.exePath);
    };

    // Abrir diálogo para seleccionar ejecutable
    $scope.selectExe = function() {
        /*if (!window.electronAPI) {
            console.error('electronAPI no disponible en selectExe');
            return;
        }*/
        
        window.electronAPI.openFileDialog().then(path => {
            if (path) {
                $scope.$apply(() => {
                    $scope.newGame.exePath = path;
                    $scope.newGame.name = path.split('\\').pop().replace('.exe', '');
                });
            }
        });
    };

    // Seleccionar imagen
    $scope.selectImage = function(event) {
        const file = event.target.files[0];
        if (file) {
            windows.electronAPI.saveImage($scope.newGame.id, file);
            $scope.newGame.image = file;
        }
    };

    // Añadir nuevo juego
    $scope.addGame = function() {
        if($scope.isEditing){
            $scope.updateGame();
        }else{
            if ($scope.newGame.name && $scope.newGame.exePath) {
                window.electronAPI.addGame({
                    name: $scope.newGame.name,
                    exePath: $scope.newGame.exePath,
                    imageData: $scope.newGame.image
                }).then(() => {
                    $scope.closeModal();
                    $scope.loadGames();
                });
            }
        }
    };

    // Cerrar modal
    $scope.closeModal = function() {
        $scope.showAddForm = false;
        $scope.newGame = { name: '', exePath: '', image: null };
    };

    // Editar juego existente
    $scope.editGame = function(game) {
        $scope.isEditing = true;
        $scope.editingGameId = game.id;
        $scope.newGame = {
            name: game.name,
            exePath: game.exePath,
            image: game.imageData
        };
        $scope.showAddForm = true;
    };

    // Actualizar juego
    $scope.updateGame = function() {
        if ($scope.newGame.name && $scope.newGame.exePath) {
            window.electronAPI.updateGame($scope.editingGameId, {
                name: $scope.newGame.name,
                exePath: $scope.newGame.exePath,
                imageData: $scope.newGame.image
            }).then(() => {
                $scope.closeModal();
                $scope.loadGames();
            });
        }
    };

    // Eliminar juego
    $scope.deleteGame = function(game) {
        if (confirm(`¿Estás seguro de que quieres eliminar "${game.name}"?`)) {
            window.electronAPI.deleteGame(game.id).then(() => {
                $scope.loadGames();
            });
        }
    };

    // Inicializar
    $scope.initElectronAPI();
});