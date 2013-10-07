/*
 * Une lettre blanche sur la matrice.
 * \param c Le caractère à afficher
 * \param x L'abscisse
 * \param y L'ordonnée
 */
WLetter = function(c, x, y)
{
	var _c = c;
	var _x = x;
	var _y = y;
	var _is_displayed = false; /* La lettre n'est pas dessinée à la création */
	var _timestamp = new Date().getTime(); /* Moment de l'instanciation */

	var _opacity = 0;

	/**
	 * \brief Dessine le caractère.
	 * \param ctx Le contexte de dessin 
	 * \param with_shadow true pour afficher l'ombrage
	 */
	this.Refresh = function(ctx, with_shadow)
	{
		_is_displayed = true;

		ctx.save();

		if(true === with_shadow)
		{
			ctx.shadowOffsetX = 0;
			ctx.shadowOffsetY = 0;
			ctx.shadowBlur = 15;
			ctx.shadowColor = "rgba(255, 255, 255, " + _opacity + ")";
		}

		ctx.fillStyle = "white";
		ctx.fillText(_c, _x, _y);
		ctx.restore();
	}

	/**
	 * \brief Compare la position demandée avec la nôtre.
	 * \return this si notre lettre est sur ce point, false sinon.
	 */
	this.IsMyPosition = function(x, y)
	{
		return (_x == x && _y == y) ? this : null;
	}

	/**
	 * \brief Accesseur lecture/écriture.
	 * \param opacity L'opacité entre 0 et 1
	 * \return L'opacité si opacity n'est pas renseigné.
	 */
	this.Opacity = function(opacity)
	{
		if(undefined != opacity)
		{
			if(opacity < 0)
				_opacity = 0;
			else
				_opacity = opacity;
			//console.log("Je passe de " + _opacity + ", à " + opacity);
		}
		else
			return _opacity;
	}

	/**
	 * \brief Accesseur en lecture.
	 * \return true si la lettre a déjà été dessinée, false sinon.
	 */
	this.IsDisplayed = function()
	{
		return _is_displayed;
	}

	/**
	 * \brief Accesseur en lecture.
	 * \return Le moment de l'instanciation.
	 */
	this.Timestamp = function()
	{
		return _timestamp;
	}
}
