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

        [HttpGet]
        public IActionResult GetReportForCustomer(int customerId)
        {
            var result = _reportService.GetReportForCustomer(customerId);

            if (result.Success)
            {
                return Ok(result);
            }
            return BadRequest(result);
        }

        [HttpGet]
        public IActionResult GetFilteredReportForCustomerByDateRange(int customerId, string begin, string end)
        {
            var result = _reportService.GetFilteredReportForCustomerByDateRange(customerId, begin, end);

            if (result.Success)
            {
                return Ok(result);
            }
            return BadRequest(result);
        }

        [HttpGet]
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
        public IActionResult GetFilteredReportForEmployeeByDateRange(int employeeId, string begin, string end)
        {
            var result = _reportService.GetFilteredReportForEmployeeByDateRange(employeeId, begin, end);

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

        [HttpGet]
        public IActionResult GetFilteredReportForProductByDateRange(int productId, string begin, string end)
        {
            var result = _reportService.GetFilteredReportForProductByDateRange(productId, begin, end);

            if (result.Success)
            {
                return Ok(result);
            }
            return BadRequest(result);
        }

        [HttpGet]
        public IActionResult GetReportForProductList()
        {
            var result = _reportService.GetReportForProductList();

            if (result.Success)
            {
                return Ok(result);
            }
            return BadRequest(result);
        }
    }
}
