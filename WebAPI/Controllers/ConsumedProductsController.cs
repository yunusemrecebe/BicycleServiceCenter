using Business.Abstract;
using Entities.Concrete;
using Microsoft.AspNetCore.Mvc;

namespace WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ConsumedProductsController : ControllerBase
    {
        IConsumedProductService _consumedProductService;

        public ConsumedProductsController(IConsumedProductService consumedProductService)
        {
            _consumedProductService = consumedProductService;
        }

        [HttpPost("add")]
        public IActionResult Add(ConsumedProduct consumedProduct)
        {
            var result = _consumedProductService.Add(consumedProduct);

            if (result.Success)
            {
                return Ok(result);
            }
            return BadRequest(result);
        }

        [HttpPost("delete")]
        public IActionResult Delete(int id)
        {
            var result = _consumedProductService.Delete(id);

            if (result.Success)
            {
                return Ok(result);
            }
            return BadRequest(result);
        }

        [HttpPost("update")]
        public IActionResult Update(ConsumedProduct consumedProduct)
        {
            var result = _consumedProductService.Update(consumedProduct);

            if (result.Success)
            {
                return Ok(result);
            }
            return BadRequest(result);
        }

        [HttpGet("get")]
        public IActionResult Get(int id)
        {
            var result = _consumedProductService.GetById(id);

            if (result.Success)
            {
                return Ok(result.Data);
            }
            return BadRequest(result);
        }

        [HttpGet("getall")]
        public IActionResult GetList()
        {
            var result = _consumedProductService.GetList();

            if (result.Success)
            {
                return Ok(result.Data);
            }
            return BadRequest(result);
        }

        [HttpGet("getdetails")]
        public IActionResult GetConsumedProductDetailsList()
        {
            var result = _consumedProductService.GetConsumedProductDetailsList();

            if (result.Success)
            {
                return Ok(result.Data);
            }
            return BadRequest(result);
        }

        [HttpGet("getdetailsbyprocessid")]
        public IActionResult GetConsumedProductDetailsListByProcessId(int id)
        {
            var result = _consumedProductService.GetConsumedProductDetailsListByProcessId(id);

            if (result.Success)
            {
                return Ok(result.Data);
            }
            return BadRequest(result);
        }

        [HttpGet("getdetailsbyid")]
        public IActionResult GetConsumedProductDetailsListById(int id)
        {
            var result = _consumedProductService.GetConsumedProductDetailsById(id);

            if (result.Success)
            {
                return Ok(result.Data);
            }
            return BadRequest(result);
        }
    }
}
