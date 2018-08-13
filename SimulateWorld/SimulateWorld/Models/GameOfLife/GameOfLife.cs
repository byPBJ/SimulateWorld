using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace GoPhysicist.Models.GameOfLife
{
    public class GameOfLife
    {
        public int GameId { get; set; }
        public Shape TilesShape { get; set; }
        public int NeighborNumber { get; set; }
        public List<int> LifeNumbers { get; set; }
        public List<int> ResurectionNumbers { get; set; }
        [Display(Name = "Height")]
        public int HeightNumber { get; set; }
        [Display(Name = "Width")]
        public int WidthNumber { get; set; }
        [Display(Name ="Step")]
        public int StepNo { get; set; }
        public Array PixelArray { get; set; }


        public GameOfLife()
        {
            this.TilesShape = Shape.SQUARE;
            this.NeighborNumber = 9;
            this.LifeNumbers = new List<int>
            {
                2,3
            };
            this.ResurectionNumbers = new List<int>
            {
                3
            };
            this.WidthNumber = 20;
            this.HeightNumber = 20;

        }
    }

    public enum Shape
    {
        TRIANGLE = 3,
        SQUARE = 4,
        HEXAGON = 6
    }
}
