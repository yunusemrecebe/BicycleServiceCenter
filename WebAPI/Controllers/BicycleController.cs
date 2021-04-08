using Business.Abstract;
using Entities.Concrete;
using Microsoft.AspNetCore.Mvc;

namespace WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BicyclesController : ControllerBase
    {
        IBicycleService _bicycleService;

        public BicyclesController(IBicycleService bicycleService)
        {
            _bicycleService = bicycleService;
        }

        [HttpPost("add")]
        public IActionResult Add(Bicycle bicycle)
        {
            var result = _bicycleService.Add(bicycle);
            if (result.Success)
            {
                return Ok(result);
            }
            return BadRequest(result);
        }

        [HttpPost("delete")]
        public IActionResult Delete(int id)
        {
            var result = _bicycleService.Delete(id);
            if (result.Success)
            {
                return Ok(result);
            }
            return BadRequest(result);
        }

        [HttpPost("update")]
        public IActionResult Update(Bicycle bicycle)
        {
            var result = _bicycleService.Update(bicycle);
            if (result.Success)
            {
                return Ok(result);
            }
            return BadRequest(result);
        }

        [HttpGet("get")]
        public IActionResult Get(int id)
        {
            var result = _bicycleService.GetById(id);
            if (result.Success)
            {
                return Ok(result.Data);
            }
            return BadRequest(result);
        }

        [HttpGet("getall")]
        public IActionResult GetAll(int id)
        {
            var result = _bicycleService.GetList();
            if (result.Success)
            {
                return Ok(result.Data);
            }
            return BadRequest(result);
        }

        [HttpGet("getdetails")]
        public IActionResult GetBicycleDetails(int id)
        {
            var result = _bicycleService.GetBicycleDetails();
            if (result.Success)
            {
                return Ok(result.Data);
            }
            return BadRequest(result);
        }
    }
}
