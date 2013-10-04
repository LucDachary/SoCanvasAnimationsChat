/**
 * \brief WLetter represents a white letter to show on the matrix.
 * \param c The character to draw.
 */
WLetter = function(c, x, y)
{
	//TODO : ensure we have the good types
	//TODO : ensure the values are relevant
	var _c = c;
	var _x = x;
	var _y = y;

	/*
	 * TODO : il serait plus intéressant de retrouver l'opacité de la cellule depuis le contexte de dessin 2D...
	 */
	var _opacity = 0;

	/**
	 * \brief Refreshes the layout of the character.
	 * \param ctx The 2D context
	 */
	this.Refresh = function(ctx, opacity)
	{
		ctx.save();
		//Erase the previous information area
		ctx.fillStyle = "black";
		ctx.fillText(_c, _x, _y);
		if(undefined != opacity)
		{
			ctx.fillStyle = "rgba(255, 255, 255, " + opacity + ")";
			_opacity = opacity;
		}
		else
		{
			ctx.fillStyle = "white";
			_opacity = 1;
		}
		ctx.font = "20pt monospace";
		ctx.fillText(_c, _x, _y);
		ctx.restore();
	}

	/**
	 * \brief Checks if I am the point at this x and y.
	 * \return this if I'm at this point, null otherwise.
	 */
	this.IsMyPosition = function(x, y)
	{
		return (_x == x && _y == y) ? this : null;
	}

	/**
	 * \brief Register the changement of opacity.
	 * \param opacity The opacity level (between 0 and 1) of the fade
	 */
	this.Fade = function(opacity)
	{
		_opacity -= opacity;
	}

	this.Opacity = function()
	{
		return _opacity;
	}
}
