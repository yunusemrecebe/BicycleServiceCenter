using Business.Abstract;
using Entities.Concrete;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProcessesController : ControllerBase
    {
        IProcessService _processService;

        public ProcessesController(IProcessService processService)
        {
            _processService = processService;
        }

        [HttpPost("add")]
        public IActionResult Add(Process process)
        {
            var result = _processService.Add(process);

            if (result.Success)
            {
                return Ok(result.Message);
            }
            return BadRequest(result.Message);
        }

        [HttpPost("delete")]
        public IActionResult Delete(int id)
        {
            var result = _processService.Delete(id);

            if (result.Success)
            {
                return Ok(result.Message);
            }
            return BadRequest(result.Message);
        }

        [HttpPost("update")]
        public IActionResult Update(Process process)
        {
            var result = _processService.Update(process);

            if (result.Success)
            {
                return Ok(result.Message);
            }
            return BadRequest(result.Message);
        }

        [HttpGet("get")]
        public IActionResult Get(int id)
        {
            var result = _processService.GetById(id);

            if (result.Success)
            {
                return Ok(result.Data);
            }
            return BadRequest(result.Message);
        }

        [HttpGet("getall")]
        public IActionResult GetList()
        {
            var result = _processService.GetList();

            if (result.Success)
            {
                return Ok(result.Data);
            }
            return BadRequest(result.Message);
        }

        [HttpGet("getprocessdetails")]
        public IActionResult GetProcessDetails()
        {
            var result = _processService.GetProcessDetails();

            if (result.Success)
            {
                return Ok(result.Data);
            }
            return BadRequest(result.Message);
        }
    }
}
