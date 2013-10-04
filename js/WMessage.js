
/**
 * \brief Manage a list of WLetters. Represents a white message.
 * \param ctx The 2D context.
 * \param ttl Time to be displayed in seconds.
 */
WMessage = function(ctx, ttl)
{
	var _ctx = ctx;
	var _wletters = new Array();

	this.Add = function(wletter)
	{
		//TODO : ensure wletter is type of WLetter
		//TODO : control there is not yet a point at this place. If there is already a point, remove it or throw an exception
		_wletters.push(wletter);
	}

	this.IsLetter = function(x, y)
	{
		for(var i = 0; i < _wletters.length; i++)
		{
			if(null !== _wletters[i].IsMyPosition(x, y))
				return true;
		}
		return false;
	}

	this.Refresh = function(x, y)
	{
		var wl = null;
		for(var i = 0; i < _wletters.length; i++)
		{
			if(null !== (wl = _wletters[i].IsMyPosition(x, y)))
				break;
		}
		if(null === wl) //Nothing to refresh
		{
			console.log("Nothing to refresh.");
			return;
		}
		else
		{
			wl.Refresh(_ctx);
		}
	}

	/**
	 * \brief Informs the WLetters they have been faded.
	 * \param opacity The opacity level (between 0 and 1) of the fade
	 */
	this.Fade = function(opacity)
	{
		for(var i = 0; i < _wletters.length; i++)
		{
			_wletters[i].Fade(opacity);
		}
	}

	this.AtLeast = function(opacity)
	{
		for(var i = 0; i < _wletters.length; i++)
		{
			if(_wletters[i].Opacity() < opacity)
				_wletters[i].Refresh(_ctx, opacity);
		}
	}
}

