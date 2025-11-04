# Stripe Webhook Debugging Guide

## Vercel Environment Variables Kontrolü

Vercel Dashboard'da şu environment variable'ların olduğundan emin ol:

1. `STRIPE_SECRET_KEY` - Stripe secret key (sk_test_... veya sk_live_...)
2. `STRIPE_WEBHOOK_SECRET` - Webhook signing secret (whsec_...)
3. `MONGODB_URI` - MongoDB bağlantı string'i
4. `NEXTAUTH_SECRET` - NextAuth secret key

## Stripe Webhook Secret Nasıl Bulunur?

1. Stripe Dashboard'a git: https://dashboard.stripe.com/webhooks
2. Webhook endpoint'ini seç
3. "Signing secret" butonuna tıkla
4. "Reveal" butonuna tıkla
5. `whsec_...` ile başlayan secret'ı kopyala
6. Vercel'de `STRIPE_WEBHOOK_SECRET` olarak ekle

## Webhook Endpoint URL'i

Vercel'de webhook endpoint'in şu formatta olmalı:
```
https://your-app.vercel.app/api/stripe/webhook
```

## Kontrol Listesi

- [ ] Vercel'de `STRIPE_WEBHOOK_SECRET` environment variable'ı var mı?
- [ ] Secret doğru mu? (`whsec_...` ile başlıyor mu?)
- [ ] Stripe Dashboard'da webhook endpoint URL doğru mu?
- [ ] Webhook'da hangi event'ler dinleniyor? (checkout.session.completed, vb.)
- [ ] Vercel logs'ları kontrol edildi mi?

## Vercel Logs Nasıl Kontrol Edilir?

1. Vercel Dashboard → Projen → Deployments
2. En son deployment'a tıkla
3. "Functions" tab'ına git
4. `/api/stripe/webhook` endpoint'ini seç
5. Logs'ları kontrol et

## Hata Durumları

### "Webhook signature verification failed"
- `STRIPE_WEBHOOK_SECRET` yanlış veya eksik
- Stripe Dashboard'dan yeni secret al ve Vercel'e ekle

### "Order not found for session"
- Order'da `stripeSessionId` field'ı doğru kaydedilmiş mi?
- Checkout API'de order oluşturulurken `stripeSessionId` set ediliyor mu?

### "Database connection failed"
- `MONGODB_URI` doğru mu?
- MongoDB Atlas'da IP whitelist'e Vercel IP'leri eklendi mi? (0.0.0.0/0 ekle)

## Test Etme

1. Stripe Dashboard → Webhooks → Test webhook
2. "Send test webhook" butonuna tıkla
3. Event type: `checkout.session.completed` seç
4. Gönder
5. Vercel logs'ları kontrol et

