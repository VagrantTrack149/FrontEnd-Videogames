angular.module('gameMenuApp', [])
.controller('MainController', function($scope, $timeout) {
    $scope.title = "Menú de Videojuegos";
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
                window.electronAPI.getImagePath(game.id).then(imagePath => {
                    if (imagePath) {
                        game.imagePath = imagePath;
                        $scope.$apply();
                    }
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
            const reader = new FileReader();
            reader.onload = (e) => {
                $scope.$apply(() => {
                    $scope.newGame.image = e.target.result;
                });
            };
            reader.readAsDataURL(file);
        }
    };

    // Añadir nuevo juego
    $scope.addGame = function() {
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
    };

    // Cerrar modal
    $scope.closeModal = function() {
        $scope.showAddForm = false;
        $scope.newGame = { name: '', exePath: '', image: null };
    };

    // Inicializar
    $scope.initElectronAPI();
});