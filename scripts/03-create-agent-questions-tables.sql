-- Creating new tables for agent questions
CREATE TABLE IF NOT EXISTS agentQuestionsOperationProperties (
    id SERIAL PRIMARY KEY,
    typeId INTEGER NOT NULL,
    questions TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS agentQuestionsTypeProperties (
    id SERIAL PRIMARY KEY,
    typeId INTEGER NOT NULL,
    questions TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_agent_questions_operation_type_id ON agentQuestionsOperationProperties(typeId);
CREATE INDEX IF NOT EXISTS idx_agent_questions_type_type_id ON agentQuestionsTypeProperties(typeId);
