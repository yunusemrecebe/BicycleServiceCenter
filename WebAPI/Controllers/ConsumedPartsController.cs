using Business.Abstract;
using Entities.Concrete;
using Microsoft.AspNetCore.Mvc;

namespace WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ConsumedPartsController : ControllerBase
    {
        IConsumedPartService _consumedPartService;

        public ConsumedPartsController(IConsumedPartService consumedPartService)
        {
            _consumedPartService = consumedPartService;
        }

        [HttpPost("add")]
        public IActionResult Add(ConsumedPart consumedPart)
        {
            var result = _consumedPartService.Add(consumedPart);

            if (result.Success)
            {
                return Ok(result.Message);
            }
            return BadRequest(result.Message);
        }

        [HttpPost("delete")]
        public IActionResult Delete(int id)
        {
            var result = _consumedPartService.Delete(id);

            if (result.Success)
            {
                return Ok(result.Message);
            }
            return BadRequest(result.Message);
        }

        [HttpPost("update")]
        public IActionResult Update(ConsumedPart consumedPart)
        {
            var result = _consumedPartService.Update(consumedPart);

            if (result.Success)
            {
                return Ok(result.Message);
            }
            return BadRequest(result.Message);
        }

        [HttpGet("get")]
        public IActionResult Get(int id)
        {
            var result = _consumedPartService.GetById(id);

            if (result.Success)
            {
                return Ok(result.Data);
            }
            return BadRequest(result.Message);
        }

        [HttpGet("getall")]
        public IActionResult GetList()
        {
            var result = _consumedPartService.GetList();

            if (result.Success)
            {
                return Ok(result.Data);
            }
            return BadRequest(result.Message);
        }
    }
}
