using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using GoPhysicist.Models.GameOfLife;

namespace GoPhysicist.Controllers
{
    public class GameController : Controller
    {
        // GET: Game
        public ActionResult GameOfLife()
        {
            GameOfLife model = new GameOfLife();
            return View(model);
        }
    }
}