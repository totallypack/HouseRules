using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HouseRules.Data;
using HouseRules.Models;
using HouseRules.Models.DTOs;

namespace HouseRules.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ChoreController : ControllerBase
{
    private HouseRulesDbContext _dbContext;

    public ChoreController(HouseRulesDbContext context)
    {
        _dbContext = context;
    }

    [HttpGet]
    [Authorize]
    public IActionResult Get()
    {
        return Ok(_dbContext
            .Chores
            .Include(c => c.ChoreCompletions)
            .Include(c => c.ChoreAssignments)
            .Select(c => new ChoreDTO
            {
                Id = c.Id,
                Name = c.Name,
                Difficulty = c.Difficulty,
                ChoreFrequencyDays = c.ChoreFrequencyDays,
                ChoreCompletions = c.ChoreCompletions.Select(cc => new ChoreCompletionDTO
                {
                    Id = cc.Id,
                    UserProfileId = cc.UserProfileId,
                    ChoreId = cc.ChoreId,
                    CompletedOn = cc.CompletedOn
                }).ToList(),
                ChoreAssignments = c.ChoreAssignments.Select(ca => new ChoreAssignmentDTO
                {
                    Id = ca.Id,
                    UserProfileId = ca.UserProfileId,
                    ChoreId = ca.ChoreId
                }).ToList()
            })
            .ToList());
    }

    [HttpGet("{id}")]
    [Authorize]
    public IActionResult GetById(int id)
    {
        var chore = _dbContext
            .Chores
            .Include(c => c.ChoreAssignments)
                .ThenInclude(ca => ca.UserProfile)
            .Include(c => c.ChoreCompletions)
            .SingleOrDefault(c => c.Id == id);

        if (chore == null)
        {
            return NotFound();
        }

        return Ok(new ChoreDTO
        {
            Id = chore.Id,
            Name = chore.Name,
            Difficulty = chore.Difficulty,
            ChoreFrequencyDays = chore.ChoreFrequencyDays,
            ChoreAssignments = chore.ChoreAssignments.Select(ca => new ChoreAssignmentDTO
            {
                Id = ca.Id,
                UserProfileId = ca.UserProfileId,
                ChoreId = ca.ChoreId,
                UserProfile = new UserProfileDTO
                {
                    Id = ca.UserProfile.Id,
                    FirstName = ca.UserProfile.FirstName,
                    LastName = ca.UserProfile.LastName,
                    Address = ca.UserProfile.Address,
                    IdentityUserId = ca.UserProfile.IdentityUserId
                }
            }).ToList(),
            ChoreCompletions = chore.ChoreCompletions.Select(cc => new ChoreCompletionDTO
            {
                Id = cc.Id,
                UserProfileId = cc.UserProfileId,
                ChoreId = cc.ChoreId,
                CompletedOn = cc.CompletedOn
            }).ToList()
        });
    }

    [HttpPost("{id}/complete")]
    [Authorize]
    public IActionResult CompleteChore(int id, [FromQuery] int userId)
    {
        var chore = _dbContext.Chores.Find(id);
        if (chore == null)
        {
            return NotFound();
        }

        var choreCompletion = new ChoreCompletion
        {
            ChoreId = id,
            UserProfileId = userId,
            CompletedOn = DateTime.Now
        };

        _dbContext.ChoreCompletions.Add(choreCompletion);
        _dbContext.SaveChanges();

        return NoContent();
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public IActionResult CreateChore([FromBody] Chore chore)
    {
        _dbContext.Chores.Add(chore);
        _dbContext.SaveChanges();
        return Created($"/api/chore/{chore.Id}", chore);
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public IActionResult UpdateChore(int id, [FromBody] Chore chore)
    {
        var choreToUpdate = _dbContext.Chores.Find(id);
        if (choreToUpdate == null)
        {
            return NotFound();
        }

        choreToUpdate.Name = chore.Name;
        choreToUpdate.Difficulty = chore.Difficulty;
        choreToUpdate.ChoreFrequencyDays = chore.ChoreFrequencyDays;

        _dbContext.SaveChanges();

        return NoContent();
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public IActionResult DeleteChore(int id)
    {
        var chore = _dbContext.Chores.Find(id);
        if (chore == null)
        {
            return NotFound();
        }

        _dbContext.Chores.Remove(chore);
        _dbContext.SaveChanges();

        return NoContent();
    }

    [HttpPost("{id}/assign")]
    [Authorize(Roles = "Admin")]
    public IActionResult AssignChore(int id, [FromQuery] int userId)
    {
        var chore = _dbContext.Chores.Find(id);
        if (chore == null)
        {
            return NotFound();
        }

        var choreAssignment = new ChoreAssignment
        {
            ChoreId = id,
            UserProfileId = userId
        };

        _dbContext.ChoreAssignments.Add(choreAssignment);
        _dbContext.SaveChanges();

        return NoContent();
    }

    [HttpPost("{id}/unassign")]
    [Authorize(Roles = "Admin")]
    public IActionResult UnassignChore(int id, [FromQuery] int userId)
    {
        var choreAssignment = _dbContext.ChoreAssignments
            .FirstOrDefault(ca => ca.ChoreId == id && ca.UserProfileId == userId);

        if (choreAssignment == null)
        {
            return NotFound();
        }

        _dbContext.ChoreAssignments.Remove(choreAssignment);
        _dbContext.SaveChanges();

        return NoContent();
    }
}
