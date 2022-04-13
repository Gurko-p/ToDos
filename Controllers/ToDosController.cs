using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ToDoApi.Models;

namespace ToDoApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ToDosController : ControllerBase
    {
        private ToDoContext db;
        public ToDosController(ToDoContext context)
        {
            db = context;
            if (!db.ToDos.Any())
            {
                db.ToDos.Add(new ToDo { ToDoDiscription = "Learn JS and ASP.Net Core!", Done = false, Date = DateTime.Now });
                db.SaveChanges();
            }
        }
        // GET api/todos
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ToDo>>> Get()
        {
            return await db.ToDos.ToListAsync();
        }

        // GET api/todos/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ToDo>> Get(int id)
        {
            ToDo todo = await db.ToDos.FirstOrDefaultAsync(t => t.Id == id);
            if (todo == null)
                return NotFound();
            return new ObjectResult(todo);
        }

        // POST api/todos
        [HttpPost]
        public async Task<ActionResult<ToDo>> Post(ToDo toDo)
        {
            
            if (toDo == null)
            {
                return BadRequest();
            }
            db.ToDos.Add(toDo);
            await db.SaveChangesAsync();
            return Ok(toDo);
        }

        // PUT api/todos/
        [HttpPut]
        public async Task<ActionResult<ToDo>> Put(ToDo todo)
        {
            if (todo == null)
            {
                return BadRequest();
            }
            if (!db.ToDos.Any(x => x.Id == todo.Id))
            {
                return NotFound();
            }
            db.ToDos.Update(todo);
            await db.SaveChangesAsync();
            return Ok(todo);
        }

        // DELETE api/todos/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<ToDo>> Delete(int id)
        {
            ToDo todo = db.ToDos.FirstOrDefault(x => x.Id == id);
            if (todo == null)
            {
                return NotFound();
            }
            db.ToDos.Remove(todo);
            await db.SaveChangesAsync();
            return Ok(todo);
        }
    }
}
