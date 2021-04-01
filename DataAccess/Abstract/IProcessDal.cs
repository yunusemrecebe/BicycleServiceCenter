using Core.DataAccess;
using Entities.Concrete;
using Entities.Dtos;
using System.Collections.Generic;

namespace DataAccess.Abstract
{
    public interface IProcessDal : IEntityRepository<Process>
    {
        List<ProcessDetailDto> GetProcessDetails();
    }
}
