angular.module('gameMenuApp', []).controller('MainController', function($scope) {
    $scope.title = "Menú de Videojuegos";
    $scope.juegos=[];
    $scope.SelectJuego=null;
    //Cargar juegos
    $scope.LoadGames=function(){
        const Pathgame='C:/Users/NeilO/OneDrive/Escritorio/Games';
        window.electronAPI.readDir(Pathgames).then(games=>{
            $scope.games=games;

        })
    }
    //ejecutar juego
    $scope.ExecuteGame=function(){
        if ($scope.SelectJuego) {
            const fullPath = path.join('C://Games', $scope.SelectJuego);
            window.electronAPI.executeGame(fullPath);
        } else {
            alert('Seleccione un juego antes de ejecutar')
        }
    };
    $scope.LoadGames();
});