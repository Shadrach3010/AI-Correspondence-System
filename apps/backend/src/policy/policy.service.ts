import { Injectable } from '@nestjs/common';

@Injectable()
export class PolicyService {
  async evaluate(data: {
    classification: string;
    department: string;
    confidence: number;
    policyFlags?: string[];
  }) {
    const policyFlags = data.policyFlags ?? [];
    const route = data.department;

    if (policyFlags.includes('CONFIDENTIAL_REVIEW_REQUIRED')) {
      return {
        approved: false,
        route,
        requiresHumanReview: true,
        reason: 'Confidential review required before auto-routing.',
      };
    }

    if (data.confidence >= 0.95) {
      return {
        approved: true,
        route,
        requiresHumanReview: false,
        reason: 'AI confidence exceeds the threshold and no institutional policy blocks automation.',
      };
    }

    return {
      approved: false,
      route,
      requiresHumanReview: true,
      reason: 'AI confidence is below the configured automated routing threshold.',
    };
  }
}
