# Example: Deep Q-Network for Multi-Agent Systems
# This demonstrates a simplified DQN implementation for MARL

import torch
import torch.nn as nn
import torch.optim as optim
import numpy as np
from collections import deque
import random


class QNetwork(nn.Module):
    """
    Neural network for approximating Q-values in multi-agent setting.
    """
    def __init__(self, state_dim, action_dim, hidden_dim=128):
        super(QNetwork, self).__init__()
        self.network = nn.Sequential(
            nn.Linear(state_dim, hidden_dim),
            nn.ReLU(),
            nn.Linear(hidden_dim, hidden_dim),
            nn.ReLU(),
            nn.Linear(hidden_dim, action_dim)
        )

    def forward(self, state):
        return self.network(state)


class ReplayBuffer:
    """
    Experience replay buffer for off-policy learning.
    """
    def __init__(self, capacity=10000):
        self.buffer = deque(maxlen=capacity)

    def push(self, state, action, reward, next_state, done):
        self.buffer.append((state, action, reward, next_state, done))

    def sample(self, batch_size):
        batch = random.sample(self.buffer, batch_size)
        states, actions, rewards, next_states, dones = zip(*batch)
        return (
            np.array(states),
            np.array(actions),
            np.array(rewards),
            np.array(next_states),
            np.array(dones)
        )

    def __len__(self):
        return len(self.buffer)


class MultiAgentDQN:
    """
    Multi-Agent Deep Q-Network implementation.
    """
    def __init__(self, num_agents, state_dim, action_dim,
                 learning_rate=1e-3, gamma=0.99, epsilon=1.0):
        self.num_agents = num_agents
        self.state_dim = state_dim
        self.action_dim = action_dim
        self.gamma = gamma
        self.epsilon = epsilon
        self.epsilon_decay = 0.995
        self.epsilon_min = 0.01

        # Create Q-networks for each agent
        self.q_networks = [
            QNetwork(state_dim, action_dim)
            for _ in range(num_agents)
        ]

        # Target networks for stable learning
        self.target_networks = [
            QNetwork(state_dim, action_dim)
            for _ in range(num_agents)
        ]

        # Optimizers
        self.optimizers = [
            optim.Adam(net.parameters(), lr=learning_rate)
            for net in self.q_networks
        ]

        # Replay buffers
        self.replay_buffers = [
            ReplayBuffer(capacity=10000)
            for _ in range(num_agents)
        ]

        # Copy weights to target networks
        self.update_target_networks()

    def select_actions(self, states):
        """
        Epsilon-greedy action selection for all agents.
        """
        actions = []
        for i, state in enumerate(states):
            if random.random() < self.epsilon:
                # Explore: random action
                action = random.randint(0, self.action_dim - 1)
            else:
                # Exploit: best action according to Q-network
                with torch.no_grad():
                    state_tensor = torch.FloatTensor(state).unsqueeze(0)
                    q_values = self.q_networks[i](state_tensor)
                    action = q_values.argmax().item()
            actions.append(action)

        return actions

    def store_transitions(self, states, actions, rewards, next_states, dones):
        """
        Store transitions in replay buffers.
        """
        for i in range(self.num_agents):
            self.replay_buffers[i].push(
                states[i], actions[i], rewards[i], next_states[i], dones[i]
            )

    def train(self, batch_size=32):
        """
        Train all agents using experience replay.
        """
        for i in range(self.num_agents):
            if len(self.replay_buffers[i]) < batch_size:
                continue

            # Sample batch
            states, actions, rewards, next_states, dones = \
                self.replay_buffers[i].sample(batch_size)

            # Convert to tensors
            states = torch.FloatTensor(states)
            actions = torch.LongTensor(actions)
            rewards = torch.FloatTensor(rewards)
            next_states = torch.FloatTensor(next_states)
            dones = torch.FloatTensor(dones)

            # Current Q-values
            current_q = self.q_networks[i](states)
            current_q = current_q.gather(1, actions.unsqueeze(1)).squeeze(1)

            # Target Q-values
            with torch.no_grad():
                next_q = self.target_networks[i](next_states)
                max_next_q = next_q.max(1)[0]
                target_q = rewards + (1 - dones) * self.gamma * max_next_q

            # Compute loss
            loss = nn.MSELoss()(current_q, target_q)

            # Optimize
            self.optimizers[i].zero_grad()
            loss.backward()
            self.optimizers[i].step()

        # Decay epsilon
        self.epsilon = max(self.epsilon_min, self.epsilon * self.epsilon_decay)

    def update_target_networks(self):
        """
        Copy weights from Q-networks to target networks.
        """
        for i in range(self.num_agents):
            self.target_networks[i].load_state_dict(
                self.q_networks[i].state_dict()
            )


# Example usage
if __name__ == "__main__":
    # Environment parameters
    num_agents = 3
    state_dim = 10
    action_dim = 4

    # Initialize multi-agent DQN
    ma_dqn = MultiAgentDQN(
        num_agents=num_agents,
        state_dim=state_dim,
        action_dim=action_dim
    )

    # Simulated training loop
    num_episodes = 1000
    for episode in range(num_episodes):
        # Reset environment (simulated)
        states = [np.random.randn(state_dim) for _ in range(num_agents)]
        episode_reward = 0

        for step in range(100):
            # Select actions
            actions = ma_dqn.select_actions(states)

            # Simulate environment step
            next_states = [np.random.randn(state_dim) for _ in range(num_agents)]
            rewards = [np.random.randn() for _ in range(num_agents)]
            dones = [False] * num_agents

            # Store transitions
            ma_dqn.store_transitions(states, actions, rewards, next_states, dones)

            # Train agents
            ma_dqn.train(batch_size=32)

            # Update states
            states = next_states
            episode_reward += sum(rewards)

        # Update target networks periodically
        if episode % 10 == 0:
            ma_dqn.update_target_networks()

        if episode % 100 == 0:
            print(f"Episode {episode}, Epsilon: {ma_dqn.epsilon:.3f}, "
                  f"Reward: {episode_reward:.2f}")
