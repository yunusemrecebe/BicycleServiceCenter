using Business.Abstract;
using Entities.Concrete;
using Microsoft.AspNetCore.Mvc;

namespace WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BicycleModelsController : ControllerBase
    {
        IBicycleModelService _bicycleModelService;

        public BicycleModelsController(IBicycleModelService bicycleModelService)
        {
            _bicycleModelService = bicycleModelService;
        }

        [HttpPost("add")]
        public IActionResult Add(BicycleModel bicycleModel)
        {
            var result = _bicycleModelService.Add(bicycleModel);

            if (result.Success)
            {
                return Ok(result);
            }
            return BadRequest(result);
        }

        [HttpPost("delete")]
        public IActionResult Delete(int id)
        {
            var result = _bicycleModelService.Delete(id);

            if (result.Success)
            {
                return Ok(result);
            }
            return BadRequest(result);
        }

        [HttpPost("update")]
        public IActionResult Update(BicycleModel bicycleModel)
        {
            var result = _bicycleModelService.Update(bicycleModel);

            if (result.Success)
            {
                return Ok(result);
            }
            return BadRequest(result);
        }

        [HttpGet("get")]
        public IActionResult Get(int id)
        {
            var result = _bicycleModelService.GetById(id);

            if (result.Success)
            {
                return Ok(result.Data);
            }
            return BadRequest(result);
        }

        [HttpGet("getall")]
        public IActionResult GetList()
        {
            var result = _bicycleModelService.GetList();

            if (result.Success)
            {
                return Ok(result.Data);
            }
            return BadRequest(result);
        }
    }
}
