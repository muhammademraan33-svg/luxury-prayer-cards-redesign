export interface PrayerTemplate {
  id: string;
  name: string;
  tradition: 'christian' | 'catholic' | 'jewish' | 'universal' | 'secular';
  text: string;
}

export const prayerTemplates: PrayerTemplate[] = [
  {
    id: 'psalm-23',
    name: 'Psalm 23',
    tradition: 'christian',
    text: `The Lord is my shepherd; I shall not want.
He maketh me to lie down in green pastures:
He leadeth me beside the still waters.
He restoreth my soul.
Yea, though I walk through the valley
of the shadow of death, I will fear no evil:
for Thou art with me.`,
  },
  {
    id: 'serenity-prayer',
    name: 'Serenity Prayer',
    tradition: 'universal',
    text: `God, grant me the serenity
to accept the things I cannot change,
the courage to change the things I can,
and the wisdom to know the difference.`,
  },
  {
    id: 'hail-mary',
    name: 'Hail Mary',
    tradition: 'catholic',
    text: `Hail Mary, full of grace,
the Lord is with thee.
Blessed art thou among women,
and blessed is the fruit of thy womb, Jesus.
Holy Mary, Mother of God,
pray for us sinners, now and at the hour of our death.
Amen.`,
  },
  {
    id: 'lords-prayer',
    name: "The Lord's Prayer",
    tradition: 'christian',
    text: `Our Father, who art in heaven,
hallowed be Thy name.
Thy kingdom come, Thy will be done,
on earth as it is in heaven.
Give us this day our daily bread,
and forgive us our trespasses.
Amen.`,
  },
  {
    id: 'eternal-rest',
    name: 'Eternal Rest',
    tradition: 'catholic',
    text: `Eternal rest grant unto them, O Lord,
and let perpetual light shine upon them.
May they rest in peace.
Amen.`,
  },
  {
    id: 'st-francis',
    name: 'Prayer of St. Francis',
    tradition: 'catholic',
    text: `Lord, make me an instrument of Your peace.
Where there is hatred, let me sow love;
where there is injury, pardon;
where there is doubt, faith;
where there is despair, hope;
where there is darkness, light.`,
  },
  {
    id: 'irish-blessing',
    name: 'Irish Blessing',
    tradition: 'universal',
    text: `May the road rise up to meet you.
May the wind be always at your back.
May the sun shine warm upon your face,
and rains fall soft upon your fields.
And until we meet again,
may God hold you in the palm of His hand.`,
  },
  {
    id: 'apache-blessing',
    name: 'Apache Blessing',
    tradition: 'secular',
    text: `May the sun bring you new energy by day,
may the moon softly restore you by night,
may the rain wash away your worries,
and may you walk gently through the world
and know its beauty all the days of your life.`,
  },
  {
    id: 'kaddish',
    name: 'Mourner\'s Kaddish (English)',
    tradition: 'jewish',
    text: `Glorified and sanctified be God's great name
throughout the world which He has created
according to His will.
May He establish His kingdom in your lifetime
and during your days.
Blessed be His great name forever and to all eternity.`,
  },
  {
    id: 'remember-me',
    name: 'Remember Me',
    tradition: 'secular',
    text: `Do not stand at my grave and weep,
I am not there, I do not sleep.
I am a thousand winds that blow,
I am the diamond glints on snow.
I am the sunlight on ripened grain,
I am the gentle autumn rain.`,
  },
  {
    id: 'footprints',
    name: 'Footprints',
    tradition: 'christian',
    text: `When you saw only one set of footprints,
it was then that I carried you.
My precious child, I love you
and will never leave you
during your trials and testings.`,
  },
  {
    id: 'celebration',
    name: 'Celebration of Life',
    tradition: 'secular',
    text: `Those we love don't go away,
they walk beside us every day.
Unseen, unheard, but always near,
still loved, still missed, and very dear.`,
  },
];

export const getTraditionLabel = (tradition: PrayerTemplate['tradition']): string => {
  const labels: Record<PrayerTemplate['tradition'], string> = {
    christian: 'Christian',
    catholic: 'Catholic',
    jewish: 'Jewish',
    universal: 'Universal',
    secular: 'Non-religious',
  };
  return labels[tradition];
};
