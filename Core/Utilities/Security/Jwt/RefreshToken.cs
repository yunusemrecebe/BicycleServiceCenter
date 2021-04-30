using Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Utilities.Security.Jwt
{
    public class RefreshToken : IEntity
    {
        public int UserId { get; set; }
        public string Token { get; set; }
        public DateTime Expiration { get; set; }
    }
}
