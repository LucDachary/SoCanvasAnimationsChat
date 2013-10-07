//original source :  http://timelessname.com/sandbox/matrix.html
var matrix = document.getElementById('matrix');
var ctx = matrix.getContext('2d');

/* La toile prend tout l'espace à l'écran */
matrix.height = window.screen.availHeight;
matrix.width = window.screen.availWidth;

var ypositions = new Array(); /* Ordonnée courante pour chaque colonne */
var chars = ['0', '1'];

/*
 * Nous calculons le nombre de colonnes à dessiner en fonction
 * de la largeur du plus gros caractère.
 * Il est inutile de dessiner des colonnes qui sortent de la toile.
 */
ctx.font = "10pt monospace";
ctx.fillStyle = "#00FF00";
ctx.textAlign = "start";
ctx.textBaseline = "top";
var cw = ctx.measureText("0").width;
var ch = 9;
var nbc = Math.floor(matrix.width / cw); /* nbc pour "number of columns" */

/* Une petite initialisation */
for (i = 0; i < nbc; i++)
{
	var y = Math.random() * matrix.height * 3;
	y /= ch;
	y = Math.floor(y);
	y *= ch;

	ypositions[i] = y;
}

/* L'objet qui gère l'affichage des messages. */
var message = new WMessage(ctx, 3, matrix, ch);

/*
 * Effets sonores
 */
var skey = new Audio("sounds/key.mp3"); //Un bruit de clavier
skey.preload = "auto";
skey.loop = false;
var sbackground = new Audio("sounds/fond.mp3"); //Un fond de Matrix
sbackground.preload = "auto";
sbackground.autoplay = true;
sbackground.loop = true;


/* Fournit le caractère de l'évènement 'e', s'il existe. */
function getChar(e)
{
	if(null == e.which) //IE
		return String.fromCharCode(e.keyCode);
	else if(0 != e.which && 0 != e.charCode) //Autres navigateurs
		return String.fromCharCode(e.which);
	else
		return null; //Caractère non imprimable
}

/*
 * On récetionne les appuis claviers.
 * La touche Retour Arrière est capturée pour éviter de revenir sur la page précédente.
 * La touche Entrée provoque un changement de ligne.
 */
document.body.onkeydown = function(e)
{
	if(8 == e.keyCode) //Ret. arrière
	{
		e.preventDefault();
		if(sbackground.paused)
			sbackground.play();
		else
			sbackground.pause();
	}
	else if(13 == e.keyCode) //Entrée
	{
		message.NextLine();
		e.preventDefault();
	}
}
document.body.onkeypress = function(e)
{
	/* Aucune action sur les combinaisons Ctrl + qqch */
	if(e.ctrlKey)
		return;

	var c = getChar(e);
	if(null != c)
	{
		message.Add(c);
		skey.play();
		e.preventDefault();
	}
}

function step() 
{
	/*
	 * Dessin d'un rectangle très transparent.
	 * Tous les points précédemment tracés deviennent 5% plus transparents.
	 * Après 20 appels nous retrouvons du noir.
	 */
	var opacity = 0.05;
	ctx.save();
	ctx.globalAlpha = opacity;
	ctx.fillStyle = "black";
	ctx.fillRect(0, 0, matrix.width, matrix.height);
	ctx.restore();

	/* On maintient tous les caractères blancs opaques */
	message.KeepBright();
	message.Fade(opacity);

	ypositions.map(function (y, i){
		if(message.IsLetter(i * cw, y)){ //On doit dessiner une lettre blanche
			message.Refresh(i * cw, y);
		}
		else{
			ctx.fillText(String.fromCharCode(97 + Math.floor(Math.random() * 26)), i * cw, y);
		}

	/*
	 * Lorsque le caractère le plus récent (donc celui que nous venons de tracer)
	 * sort de la toile, sa colonne a 1% de chances d'être remise à zéro
	 * et de reprendre le tracé depuis le haut de la toile.
	 *
	 * S'il n'y a pas d'aléa toutes les colonnes repassent en haut en même temps.
	 * Le motif initial serait alors répété sans fin.
	 *
	 * En ne remettant à zéro qu'après avoir dépassé la toile nous sommes
	 * certains que toutes les colonnes traversent l'écran de haut en bas.
	 */
	if(y > matrix.height){
		if(Math.ceil(Math.random() * 100) > 98){
			ypositions[i] = 0;
		}
		else{
			this[i] += ch; /* Plus bas ! */
		}
	}
	else{
		this[i] += ch; /* Toujours plus bas ! */
	}
	}, ypositions);

	if(window.requestAnimationFrame)
		requestAnimationFrame(step);
	else //Pour toi IE
		setTimeout(step, 33);
	}

	/*
	 * Nous réalisons le premier appel à step(). Les suivants
	 * seront initiés par requestAnimationFrame().
	 */
	step();
