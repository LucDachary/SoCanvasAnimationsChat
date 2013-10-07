/**
 * \brief Gère l'affichage sur la matrice.
 * \param ctx Le contexte de dessin.
 * \param ttl Le nombre de secondes de vie des lettres blanches.
 * \param canvas La toile 
 * \param ch La hauteur d'une cellule fictive, en pixels
 */
WMessage = function(ctx, ttl, canvas, ch)
{
	var _ctx = ctx;
	var _ttl = ttl;
	var _wletters = new Array(); /* Message */
	var _canvas = canvas;

	var _w_min_x = 1 * cw;
	var _w_max_x = _canvas.width - 20 - cw;
	var _w_min_y = 10 * ch;
	var _ch = ch;
	var _delta_y = 1; /* Dispersion verticale */
	var _nb_lines = 10; /* Nombre de lignes à utiliser pour répartir le message*/
	var _lines = new Array(); /* Ordonnées de ces lignes */
	for(var i = 0; i < _nb_lines; i++)
	{
		_lines.push(
				_w_min_y /* Ordonnée de la base */
				+ _delta_y * ch * i*2 /* + la largeur des lignes intermédiaires */
				+ 2 * ch /* + un espace entre les lignes */
			   );
	}

	var _x = _w_min_x; /* Abscisse de la dernière insertion */
	var _cline = 0;

	/**
	 * \brief Ajout d'une lettre au message.
	 * La lettre est placée automatiquement en fin de message. Sa durée de vie est spécifiée à la construction de WMessage.
	 */
	this.Add = function(c)
	{
		var wl = locate(c);
		_wletters.push(wl);
	}

	/**
	 * \brief Compare une lettre de position (x,y).
	 * \param x Abscisse recherchée
	 * \param y Ordonnée recherchée
	 * \return true si une lettre a ces coordonnées, false sinon.
	 */
	this.IsLetter = function(x, y)
	{
		for(var i = 0; i < _wletters.length; i++)
		{
			if(null !== _wletters[i].IsMyPosition(x, y))
				return true;
		}
		return false;
	}

	/*
	 * \brief Maintient les lettres déjà dessinées à une opacité maximale.
	 * Cette fonction compense l'ombre appliquée à chaque étape de l'animation.
	 */
	this.KeepBright = function()
	{
		for(var i = 0; i < _wletters.length; i++)
		{
			if(_wletters[i].IsDisplayed())
				_wletters[i].Refresh(_ctx, false);
		}
	}

	/**
	 * \brief Force le dessin du caractère à la position (x, y)
	 * \param x Abscisse à redessiner.
	 * \param y Ordonnée à redessiner.
	 */
	this.Refresh = function(x, y)
	{
		removeOld();

		var wl = null;
		for(var i = 0; i < _wletters.length; i++)
		{
			if(null !== (wl = _wletters[i].IsMyPosition(x, y)))
				break;
		}
		
		if(null === wl)
		{
			console.log("Nothing to refresh.");
			return;
		}
		else
		{
			wl.Opacity(1);
			wl.Refresh(_ctx, true);
		}
	}

	/**
	 * \brief Décrémente le compteur d'opacité interne de chaque lettre, pour suivre les modifications de la toile.
	 * \param opacity Le degré d'opacité supplémentaire (entre 0 et 1).
	 */
	this.Fade = function(opacity)
	{
		for(var i = 0; i < _wletters.length; i++)
		{
			_wletters[i].Opacity(_wletters[i].Opacity() - opacity);
			_wletters[i].Refresh(_ctx, true);
		}
	}

	/**
	 * \brief Removes the letters that have been displayed at least nbs seconds.
	 */
	function removeOld() 
	{
		for(var i = 0; i < _wletters.length; i++)
		{
			var ts = _wletters[i].Timestamp();

			var now = new Date().getTime();

			if((now - ts) > _ttl * 1000)
				_wletters.splice(i, 1);
		}
	}

	/**
	 * \brief Calcule la position du caractère c.
	 * \param c Le caractère à dessiner.
	 * \return Un nouvel objet WLetter.
	 */
	function locate(c)
	{
		//Dispersion horizontale, finalement je ne l'utilise pas
		//_x += cw * Math.ceil(Math.random() * 2);
		_x += cw;

		if(_x > _w_max_x) //Too far on the line, take a new one
		{
			_x = _w_min_x;
			_cline++;	
		}

		var cline_y = _lines[_cline%_lines.length];
		var y = Math.random() * _delta_y * _ch;

		y /= ch;
		y = Math.floor(y);
		y *= ch;
		y += cline_y;

		return new WLetter(c, _x, y);
	}

	/**
	 * \brief Change de ligne. Une fois arrivé à la dernière ligne, l'affichage reprend sur la première.
	 */
	this.NextLine = function()
	{
		_x = _w_min_x;
		_cline++;
	}
}

