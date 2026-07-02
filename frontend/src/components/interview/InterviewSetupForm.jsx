import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Select from '../common/Select.jsx';
import Button from '../common/Button.jsx';
import { createSessionApi, generateQuestionsApi } from '../../api/interviewApi.js';
import { JOB_ROLES, EXPERIENCE_LEVELS, TOPICS } from '../../utils/constants.js';

const QUESTION_COUNT_OPTIONS = [
  { value: '3',  label: '3 Questions  (Quick — ~6 min)' },
  { value: '5',  label: '5 Questions  (Standard — ~10 min)' },
  { value: '7',  label: '7 Questions  (Thorough — ~14 min)' },
  { value: '10', label: '10 Questions (Full — ~20 min)' },
  { value: '15', label: '15 Questions (Deep Dive — ~30 min)' },
];

export default function InterviewSetupForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    role: '',
    experienceLevel: '',
    topic: '',
    questionCount: '5'
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.role || !form.experienceLevel || !form.topic) {
      toast.error('Please fill all fields');
      return;
    }
    setLoading(true);
    try {
      const payload = { ...form, questionCount: Number(form.questionCount) };
      const { data: sessionData } = await createSessionApi(payload);
      const sessionId = sessionData.session._id;
      await generateQuestionsApi(sessionId);
      toast.success('Interview session ready!');
      navigate(`/interview/session/${sessionId}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not start interview');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="interview-setup-form">
      <h2>Set Up Your Mock Interview</h2>

      <Select
        label="Target Role"
        name="role"
        value={form.role}
        onChange={handleChange}
        options={JOB_ROLES}
        placeholder="Select a role"
      />
      <Select
        label="Experience Level"
        name="experienceLevel"
        value={form.experienceLevel}
        onChange={handleChange}
        options={EXPERIENCE_LEVELS}
        placeholder="Select experience level"
      />
      <Select
        label="Topic"
        name="topic"
        value={form.topic}
        onChange={handleChange}
        options={TOPICS}
        placeholder="Select a topic"
      />
      <Select
        label="Number of Questions"
        name="questionCount"
        value={form.questionCount}
        onChange={handleChange}
        options={QUESTION_COUNT_OPTIONS}
      />

      {loading && (
        <p style={{ textAlign: 'center', color: '#6b7280', fontSize: '0.875rem' }}>
          Generating {form.questionCount} AI questions... please wait ⏳
        </p>
      )}

      <Button type="submit" loading={loading} fullWidth>
        Start Interview
      </Button>
    </form>
  );
}