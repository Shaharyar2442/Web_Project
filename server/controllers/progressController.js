import Session from '../models/Session.js';
import PRRecord from '../models/PRRecord.js';

export const getPRs = async (req, res) => {
  try {
    const prs = await PRRecord.find({ user: req.user._id }).sort({ updatedAt: -1 });
    res.status(200).json(prs);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching PRs' });
  }
};

export const getChartsData = async (req, res) => {
  try {
    const { exerciseId } = req.params;
    const { timeRange } = req.query; // '30', '90', '180', 'all'
    
    let dateFilter = {};
    if (timeRange && timeRange !== 'all') {
      const days = parseInt(timeRange);
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - days);
      dateFilter = { endTime: { $gte: cutoff } };
    }

    const sessions = await Session.find({ 
      user: req.user._id, 
      isActive: false, 
      'exercises.exercise': exerciseId,
      ...dateFilter
    }).sort({ endTime: 1 });

    const chartData = sessions.map(session => {
      const ex = session.exercises.find(e => e.exercise.toString() === exerciseId);
      if (!ex) return null;

      let maxWeight = 0;
      let totalVolume = 0;
      let best1RM = 0;

      ex.sets.forEach(set => {
        if (set.isCompleted && set.weight > 0 && set.reps > 0) {
          totalVolume += (set.reps * set.weight);
          if (set.weight > maxWeight) maxWeight = set.weight;
          
          const est1RM = set.weight * (1 + (set.reps / 30));
          if (est1RM > best1RM) best1RM = est1RM;
        }
      });

      if (totalVolume === 0) return null;

      return {
        date: session.endTime,
        maxWeight,
        totalVolume,
        estimated1RM: Math.round(best1RM * 10) / 10
      };
    }).filter(d => d !== null);

    res.status(200).json(chartData);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching chart data' });
  }
};
