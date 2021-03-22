using Entities.Abstract;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Entities.Concrete
{
    public class ProductBrand : IEntity
    {
        public int ProductBrandId { get; set; }
        public string Name { get; set; }
    }
}
