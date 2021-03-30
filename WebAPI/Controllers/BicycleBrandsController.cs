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
    public class BicycleBrandsController : ControllerBase
    {
        IBicycleBrandService _bicycleBrandService;

        public BicycleBrandsController(IBicycleBrandService bicycleBrandService)
        {
            _bicycleBrandService = bicycleBrandService;
        }

        [HttpPost("add")]
        public IActionResult Add(BicycleBrand bicycleBrand)
        {
            var result = _bicycleBrandService.Add(bicycleBrand);

            if (result.Success)
            {
                return Ok(result.Message);
            }
            return BadRequest(result.Message);
        }

        [HttpPost("delete")]
        public IActionResult Delete(int id)
        {
            var result = _bicycleBrandService.Delete(id);

            if (result.Success)
            {
                return Ok(result.Message);
            }
            return BadRequest(result.Message);
        }

        [HttpPost("update")]
        public IActionResult Update(BicycleBrand bicycleBrand)
        {
            var result = _bicycleBrandService.Update(bicycleBrand);

            if (result.Success)
            {
                return Ok(result.Message);
            }
            return BadRequest(result.Message);
        }

        [HttpGet("get")]
        public IActionResult Get(int id)
        {
            var result = _bicycleBrandService.GetById(id);

            if (result.Success)
            {
                return Ok(result.Message);
            }
            return BadRequest(result.Message);
        }

        [HttpGet("getall")]
        public IActionResult GetList()
        {
            var result = _bicycleBrandService.GetList();

            if (result.Success)
            {
                return Ok(result.Data);
            }
            return BadRequest(result.Message);
        }
    }
}
