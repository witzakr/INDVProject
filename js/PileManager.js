class PileManager {
  constructor() {
    this.pending  = document.getElementById('pile-left');
    this.approved = document.getElementById('pile-approved');
    this.rejected = document.getElementById('pile-rejected');
  }

  addCard(pile, stampSrc = null) {
    if (!pile) return;
    const card = document.createElement('div');
    card.className = 'pile-card';

    const offsetX  = (Math.random() - 0.5) * 12;
    const offsetY  = -pile.children.length * 4;
    const rotation = (Math.random() - 0.5) * 10;
    card.style.transform = `translate(${offsetX}px, ${offsetY}px) rotate(${rotation}deg)`;

    if (stampSrc) {
      const img = document.createElement('img');
      img.src = stampSrc;
      img.alt = '';
      img.className = 'pile-card-stamp';
      card.appendChild(img);
    }

    pile.appendChild(card);
  }

  removeTopCard(pile) {
    if (!pile || pile.children.length === 0) return;
    pile.removeChild(pile.lastElementChild);
  }

  initPending(count) {
    for (let i = 0; i < count; i++) this.addCard(this.pending);
  }

  sendToApproved(stampSrc) { this.addCard(this.approved, stampSrc); }
  sendToRejected(stampSrc) { this.addCard(this.rejected, stampSrc); }
  takePending()            { this.removeTopCard(this.pending); }

  get pendingCount() {
    return this.pending ? this.pending.children.length : 0;
  }
}
