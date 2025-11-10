using System.ComponentModel.DataAnnotations;

namespace HouseRules.Models.DTOs;

public class ChoreDTO
{
    public int Id { get; set; }

    [Required]
    [MaxLength(100, ErrorMessage = "Chore names must be 100 characters or less")]
    public string Name { get; set; }

    [Required]
    [Range(1, 5)]
    public int Difficulty { get; set; }

    [Required]
    [Range(1, 14, ErrorMessage = "Chore frequency must be between 1 and 14 days")]
    public int ChoreFrequencyDays { get; set; }

    public List<ChoreAssignmentDTO> ChoreAssignments { get; set; }
    public List<ChoreCompletionDTO> ChoreCompletions { get; set; }

    public bool IsOverdue
    {
        get
        {
            if (ChoreCompletions == null || !ChoreCompletions.Any())
            {
                return true;
            }

            var mostRecentCompletion = ChoreCompletions.Max(cc => cc.CompletedOn);
            return mostRecentCompletion.AddDays(ChoreFrequencyDays) < DateTime.Today;
        }
    }
}
