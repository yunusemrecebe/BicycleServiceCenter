using Business.Abstract;
using Microsoft.AspNetCore.Mvc;

namespace WebAPI.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class ReportsController : ControllerBase
    {
        IReportService _reportService;

        public ReportsController(IReportService reportService)
        {
            _reportService = reportService;
        }

        [HttpPost]
        public IActionResult GetReportForCustomer(int customerId)
        {
            var result = _reportService.GetReportForCustomer(customerId);

            if (result.Success)
            {
                return Ok(result);
            }
            return BadRequest(result);
        }

        [HttpPost]
        public IActionResult GetReportForEmployee(int employeeId)
        {
            var result = _reportService.GetReportForEmployee(employeeId);

            if (result.Success)
            {
                return Ok(result);
            }
            return BadRequest(result);
        }

        [HttpGet]
        public IActionResult GetReportForEmployeeList()
        {
            var result = _reportService.GetReportForEmployeeList();

            if (result.Success)
            {
                return Ok(result);
            }
            return BadRequest(result);
        }

       [HttpGet]
        public IActionResult GetReportForProduct(int productId)
        {
            var result = _reportService.GetReportForProduct(productId);

            if (result.Success)
            {
                return Ok(result);
            }
            return BadRequest(result);
        }
    }
}
