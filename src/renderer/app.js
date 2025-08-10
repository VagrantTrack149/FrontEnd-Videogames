angular.module('gameMenuApp', [])
.controller('MainController', function($scope) {
  $scope.title = "Menú de Videojuegos";
  $scope.games = [];
  $scope.showAddForm = false;
  $scope.newGame = {
    name: '',
    exePath: '',
    image: null
  };

  // Cargar juegos
  $scope.loadGames = function() {
    if (window.electronAPI) {
        window.electronAPI.getGames().then(games => {
        $scope.games = games;
        $scope.$apply();
        });    
    }else{
        setTimeout($scope.loadGames, 1000); // Reintentar si electronAPI no está disponible
    }
    
    
  };

  // Ejecutar juego al hacer clic
  $scope.playGame = function(game) {
    window.electronAPI.executeGame(game.exePath);
  };

  // Abrir diálogo para seleccionar ejecutable
  $scope.selectExe = function() {
    //if(window.electronAPI){
        window.electronAPI.openFileDialog().then(path => {
        if (path) {
            $scope.newGame.exePath = path;
            $scope.newGame.name = path.split('\\').pop().replace('.exe', '');
            $scope.$apply();
        }
        });
    //}else{
    //    setTimeout($scope.selectExe, 500); // Reintentar si electronAPI no está disponible
    //}
    
  };

  // Seleccionar imagen
  $scope.selectImage = function(event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        $scope.newGame.image = e.target.result;
        $scope.$apply();
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
        $scope.showAddForm = false;
        $scope.newGame = { name: '', exePath: '', image: null };
        $scope.loadGames();
      });
    }
  };

  // Inicializar
  $scope.loadGames();
});