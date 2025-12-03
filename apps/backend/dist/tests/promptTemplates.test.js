"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const promptTemplates_1 = require("../services/ai/promptTemplates");
describe('PromptTemplates', () => {
    describe('taskBreakdown', () => {
        it('should generate a comprehensive task breakdown prompt', () => {
            const request = {
                taskTitle: 'Write research paper on photosynthesis',
                taskDescription: '5-page paper for biology class',
                complexity: 'medium',
                context: {
                    subjects: [
                        { id: '1', name: 'Biology', description: 'Study of living organisms' }
                    ],
                    currentTasks: [
                        { id: '1', title: 'Complete math homework', priority: 'high' }
                    ]
                }
            };
            const prompt = promptTemplates_1.PromptTemplates.taskBreakdown(request);
            expect(prompt).toContain('ACADEMIC GUARDRAILS');
            expect(prompt).toContain('Write research paper on photosynthesis');
            expect(prompt).toContain('5-page paper for biology class');
            expect(prompt).toContain('medium');
            expect(prompt).toContain('Student\'s Subjects: Biology');
            expect(prompt).toContain('Current Tasks: Complete math homework (high)');
            expect(prompt).toContain('subtasks');
            expect(prompt).toContain('estimatedMinutes');
            expect(prompt).toContain('priority');
            expect(prompt).toContain('Focus only on academic tasks');
        });
        it('should handle minimal task breakdown request', () => {
            const request = {
                taskTitle: 'Study for quiz',
                complexity: 'simple'
            };
            const prompt = promptTemplates_1.PromptTemplates.taskBreakdown(request);
            expect(prompt).toContain('Study for quiz');
            expect(prompt).toContain('simple');
            expect(prompt).toContain('subtasks');
            expect(prompt).not.toContain('Student\'s Subjects:');
        });
    });
    describe('dailyStudyPlan', () => {
        it('should generate a comprehensive daily study plan prompt', () => {
            const request = {
                date: '2024-01-15',
                availableHours: 6,
                focusSubjects: ['Mathematics', 'Biology'],
                goals: ['Complete calculus exercises', 'Review biology chapter'],
                energyLevel: 'high',
                context: {
                    subjects: [
                        { id: '1', name: 'Mathematics' },
                        { id: '2', name: 'Biology' }
                    ],
                    currentTasks: [
                        { id: '1', title: 'Math assignment', priority: 'high' }
                    ],
                    upcomingEvents: [
                        { id: '1', title: 'Math test', startTime: '2024-01-16T09:00:00Z' }
                    ]
                }
            };
            const prompt = promptTemplates_1.PromptTemplates.dailyStudyPlan(request);
            expect(prompt).toContain('ACADEMIC GUARDRAILS');
            expect(prompt).toContain('2024-01-15');
            expect(prompt).toContain('6');
            expect(prompt).toContain('Focus Subjects: Mathematics, Biology');
            expect(prompt).toContain('Complete calculus exercises, Review biology chapter');
            expect(prompt).toContain('energyLevel: high');
            expect(prompt).toContain('Student\'s Subjects: Mathematics, Biology');
            expect(prompt).toContain('Current Tasks: Math assignment (high)');
            expect(prompt).toContain('Upcoming Events: Math test at 2024-01-16T09:00:00Z');
            expect(prompt).toContain('blocks');
            expect(prompt).toContain('startTime');
            expect(prompt).toContain('breaks');
            expect(prompt).toContain('tips');
            expect(prompt).toContain('warnings');
        });
        it('should handle minimal daily study plan request', () => {
            const request = {
                date: '2024-01-15',
                availableHours: 2,
                energyLevel: 'low'
            };
            const prompt = promptTemplates_1.PromptTemplates.dailyStudyPlan(request);
            expect(prompt).toContain('2024-01-15');
            expect(prompt).toContain('2');
            expect(prompt).toContain('energyLevel: low');
            expect(prompt).toContain('blocks');
            expect(prompt).not.toContain('Focus Subjects:');
        });
    });
    describe('recommendations', () => {
        it('should generate comprehensive recommendations prompt', () => {
            const request = {
                type: 'study_tips',
                subjectId: 'Mathematics',
                currentChallenge: 'Difficulty with calculus concepts',
                context: {
                    subjects: [
                        { id: '1', name: 'Mathematics', description: 'Advanced calculus' }
                    ],
                    currentTasks: [
                        { id: '1', title: 'Calculus homework', priority: 'high' }
                    ]
                }
            };
            const prompt = promptTemplates_1.PromptTemplates.recommendations(request);
            expect(prompt).toContain('ACADEMIC GUARDRAILS');
            expect(prompt).toContain('study_tips');
            expect(prompt).toContain('Subject: Mathematics');
            expect(prompt).toContain('Difficulty with calculus concepts');
            expect(prompt).toContain('Student\'s Subjects: Mathematics (Advanced calculus)');
            expect(prompt).toContain('Current Tasks: Calculus homework (high)');
            expect(prompt).toContain('recommendations');
            expect(prompt).toContain('title');
            expect(prompt).toContain('description');
            expect(prompt).toContain('actionable');
            expect(prompt).toContain('priority');
            expect(prompt).toContain('educational strategies');
        });
        it('should handle different recommendation types', () => {
            const request = {
                type: 'time_management',
                currentChallenge: 'Procrastination issues'
            };
            const prompt = promptTemplates_1.PromptTemplates.recommendations(request);
            expect(prompt).toContain('time_management');
            expect(prompt).toContain('Procrastination issues');
            expect(prompt).toContain('type: "time_management"');
        });
    });
    describe('studySessionHints', () => {
        it('should generate comprehensive study session hints prompt', () => {
            const request = {
                subjectId: 'Mathematics',
                topic: 'Derivatives and limits',
                sessionDuration: 60,
                learningObjective: 'Understand the concept of derivatives',
                currentProgress: 'Completed basic calculus review',
                context: {
                    subjects: [
                        { id: '1', name: 'Mathematics', description: 'Calculus' }
                    ],
                    currentTasks: [
                        { id: '1', title: 'Derivative practice problems', priority: 'medium' }
                    ]
                }
            };
            const prompt = promptTemplates_1.PromptTemplates.studySessionHints(request);
            expect(prompt).toContain('ACADEMIC GUARDRAILS');
            expect(prompt).toContain('Subject: Mathematics');
            expect(prompt).toContain('Derivatives and limits');
            expect(prompt).toContain('60');
            expect(prompt).toContain('Understand the concept of derivatives');
            expect(prompt).toContain('Completed basic calculus review');
            expect(prompt).toContain('Student\'s Subjects: Mathematics (Calculus)');
            expect(prompt).toContain('Current Tasks: Derivative practice problems (medium)');
            expect(prompt).toContain('hints');
            expect(prompt).toContain('hint');
            expect(prompt).toContain('category');
            expect(prompt).toContain('importance');
            expect(prompt).toContain('sessionPlan');
            expect(prompt).toContain('introduction');
            expect(prompt).toContain('mainActivities');
            expect(prompt).toContain('conclusion');
            expect(prompt).toContain('educational support');
        });
        it('should handle minimal study session hints request', () => {
            const request = {
                subjectId: 'Biology',
                topic: 'Cell structure',
                sessionDuration: 30
            };
            const prompt = promptTemplates_1.PromptTemplates.studySessionHints(request);
            expect(prompt).toContain('Subject: Biology');
            expect(prompt).toContain('Cell structure');
            expect(prompt).toContain('30');
            expect(prompt).toContain('hints');
            expect(prompt).not.toContain('Learning Objective:');
        });
    });
    describe('academicValidation', () => {
        it('should generate academic validation prompt', () => {
            const content = 'How can I improve my study habits for better exam performance?';
            const prompt = promptTemplates_1.PromptTemplates.academicValidation(content);
            expect(prompt).toContain('ACADEMIC GUARDRAILS');
            expect(prompt).toContain('academic content validator');
            expect(prompt).toContain('How can I improve my study habits for better exam performance?');
            expect(prompt).toContain('education, learning, or academic studies');
            expect(prompt).toContain('Study strategies and techniques');
            expect(prompt).toContain('Subject explanations and help');
            expect(prompt).toContain('Entertainment recommendations');
            expect(prompt).toContain('respond with only');
            expect(prompt).toContain('"true"');
            expect(prompt).toContain('"false"');
        });
        it('should handle long content by truncating', () => {
            const longContent = 'A'.repeat(1000);
            const prompt = promptTemplates_1.PromptTemplates.academicValidation(longContent);
            expect(prompt).toContain('...'); // Should be truncated
            expect(prompt.length).toBeLessThan(longContent.length + 200);
        });
    });
    describe('guardrails', () => {
        it('should include academic guardrails in all prompts', () => {
            const taskRequest = { taskTitle: 'Study math', complexity: 'medium' };
            const planRequest = { date: '2024-01-15', availableHours: 4, energyLevel: 'medium' };
            const recRequest = { type: 'study_tips' };
            const hintsRequest = { subjectId: 'Math', topic: 'Algebra', sessionDuration: 60 };
            const taskPrompt = promptTemplates_1.PromptTemplates.taskBreakdown(taskRequest);
            const planPrompt = promptTemplates_1.PromptTemplates.dailyStudyPlan(planRequest);
            const recPrompt = promptTemplates_1.PromptTemplates.recommendations(recRequest);
            const hintsPrompt = promptTemplates_1.PromptTemplates.studySessionHints(hintsRequest);
            expect(taskPrompt).toContain('ONLY assist with educational, learning, and academic content');
            expect(planPrompt).toContain('ONLY assist with educational, learning, and academic content');
            expect(recPrompt).toContain('ONLY assist with educational, learning, and academic content');
            expect(hintsPrompt).toContain('ONLY assist with educational, learning, and academic content');
        });
    });
});
//# sourceMappingURL=promptTemplates.test.js.map