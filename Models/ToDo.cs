using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ToDoApi.Models
{
    public class ToDo
    {
        public int Id { get; set; }
        public string ToDoDiscription { get; set; }
        public bool Done { get; set; } = false;

        [DataType(DataType.Date)]
        public DateTime Date { get; set; } = DateTime.Now;
    }
}
