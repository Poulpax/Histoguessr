//Jquerry and Json setup
//InfosPhotos contain json informations
var jq = document.createElement('script');
jq.addEventListener('load', proceed); // pass my hoisted function
jq.src = 'jquery-3.5.1.min.js';
document.querySelector('head').appendChild(jq);

function proceed() {
	$.getJSON('http://localhost/InfoPhotos.json', function(data) {
		infosPhotos = data;
		main();
	});
}

//en rapport avec les essaie et le score
var attempt = new Number(3);

//en rapport avec les photos
var nbPictureOfYear = new Number(3); //Nombre de photos correspondant à l'année recherché
var listPicture = new Array(); // la liste des photos selectionner pour le round
var actualPhoto; // la photo acfficher actuellement
var infosPhotos; //le fichier Json

//en rapport avec combien le joueur utilise de photos pour guess et la navigation
var pictureNumber = new Number(-1); //le numero de la photo selectionner dans la liste
var picMax = new Number(-1); //la photo maximal utilisé (permet de compter les points gagné à ce round)

//classe d'une photo
class ActualPhoto {
	constructor(year, src) {
		this.year = year;
		this.src = src;
	}
}

//Appelé a chaque debut de round elle permet d'initer celui-ci
function main() {
	setAttempt();
	picMax = 0;
	listPicture.length = 0;

	document.getElementById('valider').addEventListener('click', valide);

	document.getElementById('inputNumber').value = '';

	var theYear = getRandomYear();
	randomPicture(theYear);
	pictureNavigation();
}

//Gere la navigation entre les photos
function pictureNavigation() {
	let previousButton = document.getElementById('previous');
	let nextButton = document.getElementById('next');

	if (pictureNumber == 0 && pictureNumber != nbPictureOfYear - 1) {
		//Ou qu'il y en a plus
		previousButton.style.display = 'none';
		nextButton.style.display = '';
	} else if (pictureNumber == nbPictureOfYear - 1) {
		//Si on est à la derniere photo on affiche seulement le boutton pour voir la photo précedente
		previousButton.style.display = '';
		nextButton.style.display = 'none';

		if (pictureNumber == 0) {
			//Si on est à la derniere photo mais aussi la premiere
			nextButton.style.display = 'none';
			previousButton.style.display = 'none';
		}
	} else {
		previousButton.style.display = '';
		nextButton.style.display = '';
	}

	previousButton.addEventListener('click', previousPicture);

	nextButton.addEventListener('click', nextPicture);
}

//fonction appelé lorsque l'on appuie sur le bouton pour aller à la photo précendente
function previousPicture() {
	let picture = document.getElementById('mainPicture');
	picture.src = listPicture[--pictureNumber].src;
	pictureNavigation();
}

//fonction appelé lorsque l'on appuie sur le bouton pour aller à la photo suivante
function nextPicture() {
	let picture = document.getElementById('mainPicture');
	picture.src = listPicture[++pictureNumber].src;
	pictureNavigation();
	picMax++;
}

//Permet de mettre en place les essai au debut d'une manche
function setAttempt() {
	attempt = 3;
	let attemptElmt = document.getElementById('attempt');
	attemptElmt.innerText = attempt;
}

//Permet d'avoir une année aléatoire comprise entre l'année la plus basse possible et la plus haute. Retourne alors cette année.
function getRandomYear() {
	minYear = 1827;
	var date = new Date();
	var annee = date.getFullYear();
	var randomYear = Math.floor(Math.random() * (annee - minYear)) + minYear;

	return randomYear;
}

//remplace dans le fichier HTML la source de la photo par la premiere photo de la liste des 3 photos sélectioné pour cette manche
function randomPicture(pictureYear) {
	let picture = document.getElementById('mainPicture');

	var numberOfPictureOfYear = getNumberPictureOfYear(pictureYear).length;

	//Si le nombre de photo de cette année est plus grand ou egal a 3 alors on aura trois photo sinon on en aura moins
	if (numberOfPictureOfYear >= 3) {
		nbPictureOfYear = 3;
	} else if (numberOfPictureOfYear != 0) {
		nbPictureOfYear = numberOfPictureOfYear;
	} else {
		randomPicture(getRandomYear());
	}

	while (listPicture.length < nbPictureOfYear) {
		//tant que l'on à pas le nombre de photos que l'on veut pour la manche on ajoute une nouvelle photo à la liste
		listPicture.push(getNewPicture(pictureYear));
	}
	//On affiche au debut la premiere photo de la liste
	picture.src = listPicture[0].src;
	pictureNumber = 0;
}

//Retourn un tableau avec toutes les photos de l'année en parametre
function getNumberPictureOfYear(year) {
	var pictureOfThisYear = new Array();

	infosPhotos.forEach((element) => {
		if (element.Year == year) {
			pictureOfThisYear.push(element);
		}
	});

	return pictureOfThisYear;
}

//Retourne une photo si elle correspond à l'année demandé et si elle n'est pas déjà dans les 3 photos sélectioné pour cette manche
function getNewPicture(pictureYear) {
	var isSame = false;
	nbPicture = infosPhotos.length;
	var randomPictureNumb = Math.floor(Math.random() * (nbPicture - 1) + 1);

	//permet de verifier si la photo n'est pas déjà dans la liste des 3 photos pour cette manche
	for (let i = 0; i < listPicture.length; i++) {
		if (infosPhotos[randomPictureNumb].src == listPicture[i].src) {
			isSame = true;
		}
	}

	if (!isSame && infosPhotos[randomPictureNumb].Year == pictureYear) {
		//Si elle n'est pas déjà selectionner et que elle correspond à l'année que l'on cherche on la retourne
		actualPhoto = new ActualPhoto(infosPhotos[randomPictureNumb].Year, infosPhotos[randomPictureNumb].src);
		return actualPhoto;
	} else {
		//Sinon on re-appele cette fonction
		return getNewPicture(pictureYear);
	}
}

//Ajoute le score au joueur si il trouve la bonne année
function addScore() {
	let score = document.getElementById('score');
	switch (picMax) {
		case 0: //100 pts si il n'utilise que 1 photos parmis les 3.
			score.innerText = parseInt(score.innerText) + 100;
			break;
		case 1: //75 pts si il en utilise 2
			score.innerText = parseInt(score.innerText) + 75;
			break;
		case 2: //50pts si il utilise les 3
			score.innerText = parseInt(score.innerText) + 50;
			break;
		default:
			console.log(picMax);
	}
	main();
}

//Fonction appelé lorsque l'on appuie sur le bonton valider
function valide() {
	let input = document.getElementById('inputNumber');
	//determine si le joueur à entrée l'année correspondant aux photos
	if (input.value == actualPhoto.year) {
		// si c'est le cas on ajoute le score au joueur
		addScore();
		alert('gg');
	} else {
		//sinon on enleve un essai au joueur qui en à 3 au debut d'une manche
		alert('pas de pot');
		attempt--;
		if (attempt == 0) {
			//si il arrive à 0 essai alors on redemare une nouvelle manche
			main();
		} else {
			//sinon on affiche qu'il reset un essai de moin au joueur
			let attemptElmt = document.getElementById('attempt');
			attemptElmt.innerText = attempt;
		}
	}
}
