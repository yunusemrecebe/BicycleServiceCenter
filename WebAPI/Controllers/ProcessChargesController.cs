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
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class ProcessChargesController : ControllerBase
    {
        IProcessChargeService _processChargeService;

        public ProcessChargesController(IProcessChargeService processChargeService)
        {
            _processChargeService = processChargeService;
        }

        [HttpPost]
        public IActionResult Calculate(int processId)
        {
            var result = _processChargeService.Calculate(processId);

            if (result.Success)
            {
                return Ok(result);
            }
            return BadRequest(result);
        }

        [HttpPost]
        public IActionResult Add(ProcessCharge processCharge)
        {
            var result = _processChargeService.Add(processCharge);

            if (result.Success)
            {
                return Ok(result);
            }
            return BadRequest(result);
        }

        [HttpPost]
        public IActionResult Delete(int id)
        {
            var result = _processChargeService.Delete(id);

            if (result.Success)
            {
                return Ok(result);
            }
            return BadRequest(result);
        }

        [HttpPost]
        public IActionResult Update(ProcessCharge processCharge)
        {
            var result = _processChargeService.Update(processCharge);

            if (result.Success)
            {
                return Ok(result);
            }
            return BadRequest(result);
        }

        [HttpGet]
        public IActionResult GetById(int id)
        {
            var result = _processChargeService.GetById(id);

            if (result.Success)
            {
                return Ok(result);
            }
            return BadRequest(result);
        }

        [HttpGet]
        public IActionResult GetByConsumedPartId(int id)
        {
            var result = _processChargeService.GetByConsumedProductId(id);

            if (result.Success)
            {
                return Ok(result);
            }
            return BadRequest(result);
        }


        [HttpGet]
        public IActionResult GetAll()
        {
            var result = _processChargeService.GetList();

            if (result.Success)
            {
                return Ok(result);
            }
            return BadRequest(result);
        }
    }
}
