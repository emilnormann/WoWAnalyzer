import { t } from '@lingui/macro';
import { formatPercentage } from 'common/format';
import SPELLS from 'common/SPELLS';
import { SpellLink } from 'interface';
import Analyzer from 'parser/core/Analyzer';
import { ThresholdStyle, When } from 'parser/core/ParseResults';
import React from 'react';

import EnergyTracker from '../features/EnergyTracker';

class TigersFuryEnergy extends Analyzer {
  static dependencies = {
    energyTracker: EnergyTracker,
  };

  energyTracker!: EnergyTracker;

  get energyGenerated() {
    return this.energyTracker.getGeneratedBySpell(SPELLS.TIGERS_FURY.id);
  }

  get energyWasted() {
    return this.energyTracker.getWastedBySpell(SPELLS.TIGERS_FURY.id);
  }

  get totalEnergy() {
    return this.energyGenerated + this.energyWasted;
  }

  get percentWasted() {
    return this.energyWasted / this.totalEnergy || 0;
  }

  get suggestionThresholds() {
    return {
      actual: this.percentWasted,
      isGreaterThan: {
        minor: 0,
        average: 0.1,
        major: 0.25,
      },
      style: ThresholdStyle.PERCENTAGE,
    };
  }

  suggestions(when: When) {
    when(this.suggestionThresholds).addSuggestion((suggest, actual, recommended) =>
      suggest(
        <>
          You are wasting energy generated by <SpellLink id={SPELLS.TIGERS_FURY.id} />. Spend down
          your energy before using <SpellLink id={SPELLS.TIGERS_FURY.id} /> to avoid waste.
        </>,
      )
        .icon(SPELLS.TIGERS_FURY.icon)
        .actual(
          t({
            id: 'druid.feral.suggestions.tigerFuryEnergy.energyWasted',
            message: `${formatPercentage(actual, 0)}% of generated energy wasted.`,
          }),
        )
        .recommended(`No waste is recommended`),
    );
  }
}

export default TigersFuryEnergy;